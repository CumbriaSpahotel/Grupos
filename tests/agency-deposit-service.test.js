const test = require('node:test');
const assert = require('node:assert/strict');
const agencyService = require('../src/services/agencyDepositService');

function createMockFirestore(initialData = {}) {
  const store = new Map();
  // initialData keys format: "col/doc" or "col/doc/subcol/subdoc"
  for (const [k, v] of Object.entries(initialData)) {
    store.set(k, JSON.parse(JSON.stringify(v)));
  }

  function getDocRef(path) {
    return {
      id: path.split('/').pop(),
      path,
      get: async () => {
        const val = store.get(path);
        return {
          exists: store.has(path),
          data: () => (val ? JSON.parse(JSON.stringify(val)) : undefined)
        };
      },
      collection: (subName) => ({
        doc: (subId) => getDocRef(`${path}/${subName}/${subId || 'doc_' + Math.random().toString(36).substring(2, 9)}`),
        orderBy: () => ({
          limit: () => ({
            get: async () => {
              const prefix = `${path}/${subName}/`;
              const docs = [];
              for (const [k, val] of store.entries()) {
                if (k.startsWith(prefix) && k.slice(prefix.length).indexOf('/') === -1) {
                  docs.push({ id: k.split('/').pop(), data: () => ({ ...val }) });
                }
              }
              return { docs };
            }
          })
        })
      })
    };
  }

  const db = {
    collection: (colName) => ({
      doc: (docId) => getDocRef(`${colName}/${docId}`),
      get: async () => {
        const prefix = `${colName}/`;
        const docs = [];
        for (const [k, val] of store.entries()) {
          if (k.startsWith(prefix) && k.slice(prefix.length).indexOf('/') === -1) {
            docs.push({ id: k.split('/').pop(), data: () => ({ ...val }) });
          }
        }
        return { docs };
      }
    }),
    runTransaction: async (fn) => {
      const writes = [];
      const tx = {
        get: async (docRef) => {
          const val = store.get(docRef.path);
          return {
            exists: store.has(docRef.path),
            data: () => (val ? JSON.parse(JSON.stringify(val)) : undefined)
          };
        },
        set: (docRef, data, options) => {
          writes.push(() => {
            const current = store.get(docRef.path) || {};
            const next = options?.merge ? { ...current, ...data } : { ...data };
            store.set(docRef.path, next);
          });
        },
        update: (docRef, data) => {
          writes.push(() => {
            const current = store.get(docRef.path) || {};
            store.set(docRef.path, { ...current, ...data });
          });
        }
      };
      const res = await fn(tx);
      for (const w of writes) w();
      return res;
    },
    _rawStore: store
  };

  return db;
}

test('normaliza el nombre de agencia correctamente', () => {
  assert.equal(agencyService.normalizeAgencyKey(' Viajes Halcón S.L. '), 'viajes_halcon_s_l');
  assert.equal(agencyService.normalizeAgencyKey('BedsOnline'), 'bedsonline');
  assert.equal(agencyService.normalizeAgencyKey(''), '');
});

test('ingresa depósito y actualiza saldo de agencia', async () => {
  const db = createMockFirestore();
  const res = await agencyService.registerDepositPayment({
    db,
    agencyName: 'Viajes Halcón',
    amount: 5000,
    reference: 'TRANSF-001'
  });

  assert.equal(res.success, true);
  assert.equal(res.newBalance, 5000);

  const agency = await agencyService.getAgencyDeposit(db, 'Viajes Halcón');
  assert.equal(agency.currentBalance, 5000);
  assert.equal(agency.totalDeposited, 5000);
  assert.equal(agency.totalConsumed, 0);

  // Segundo ingreso
  await agencyService.registerDepositPayment({
    db,
    agencyName: 'Viajes Halcón',
    amount: 2500,
    reference: 'TRANSF-002'
  });

  const updatedAgency = await agencyService.getAgencyDeposit(db, 'Viajes Halcón');
  assert.equal(updatedAgency.currentBalance, 7500);
  assert.equal(updatedAgency.totalDeposited, 7500);
});

test('aplica cargo a reserva desde depósito y valida fondos', async () => {
  const db = createMockFirestore({
    'agency_deposits/viajes_halcon': {
      agencyKey: 'viajes_halcon',
      agencyName: 'Viajes Halcón',
      currentBalance: 5000,
      totalDeposited: 5000,
      totalConsumed: 0
    },
    'groups/77046': {
      Reserva: '77046',
      Nombre_Grupo: 'Gpo Jubilados Guadalajara',
      'Empresa/Agencia': 'Viajes Halcón',
      'Importe(*)': 2500,
      Com_Pagado: '0',
      PaymentPlan_JSON: '[]'
    }
  });

  // Intentar cobrar más del saldo disponible
  await assert.rejects(
    agencyService.applyDepositToReservation({
      db,
      agencyName: 'Viajes Halcón',
      reservationId: '77046',
      amount: 6000
    }),
    /Saldo insuficiente/
  );

  // Cobrar 1500 € correctamente
  const res = await agencyService.applyDepositToReservation({
    db,
    agencyName: 'Viajes Halcón',
    reservationId: '77046',
    amount: 1500
  });

  assert.equal(res.success, true);
  assert.equal(res.newAgencyBalance, 3500);
  assert.equal(res.totalPaid, 1500);

  const agencyAfter = await agencyService.getAgencyDeposit(db, 'Viajes Halcón');
  assert.equal(agencyAfter.currentBalance, 3500);
  assert.equal(agencyAfter.totalConsumed, 1500);

  const groupRaw = db._rawStore.get('groups/77046');
  assert.equal(groupRaw.Com_Pagado, '1500.00');
  assert.equal(groupRaw.depositDeducted, 1500);

  const plan = JSON.parse(groupRaw.PaymentPlan_JSON);
  assert.equal(plan.length, 1);
  assert.equal(plan[0].label, 'Cobro Depósito Agencia');
  assert.equal(plan[0].status, 'Cobrado');
  assert.equal(plan[0].paid, 1500);
});

test('reembolsa importe al depósito de la agencia por cancelación', async () => {
  const db = createMockFirestore({
    'agency_deposits/viajes_halcon': {
      agencyKey: 'viajes_halcon',
      agencyName: 'Viajes Halcón',
      currentBalance: 3500,
      totalDeposited: 5000,
      totalConsumed: 1500
    },
    'groups/77046': {
      Reserva: '77046',
      Nombre_Grupo: 'Gpo Jubilados',
      'Empresa/Agencia': 'Viajes Halcón',
      Com_Pagado: '1500.00',
      depositDeducted: 1500,
      PaymentPlan_JSON: JSON.stringify([{ label: 'Cobro Depósito Agencia', paid: 1500, status: 'Cobrado' }])
    }
  });

  const res = await agencyService.refundDepositToAgency({
    db,
    agencyName: 'Viajes Halcón',
    reservationId: '77046',
    amount: 1500,
    reason: 'Grupo cancelado por el cliente'
  });

  assert.equal(res.success, true);
  assert.equal(res.newAgencyBalance, 5000);

  const agencyAfter = await agencyService.getAgencyDeposit(db, 'Viajes Halcón');
  assert.equal(agencyAfter.currentBalance, 5000);
  assert.equal(agencyAfter.totalConsumed, 0);

  const groupAfter = db._rawStore.get('groups/77046');
  assert.equal(groupAfter.Com_Pagado, '0.00');
  assert.equal(groupAfter.depositDeducted, 0);
});

test('descuenta habitación individual con estancia de varios días', async () => {
  const db = createMockFirestore({
    'agency_deposits/viajes_halcon': {
      agencyKey: 'viajes_halcon',
      agencyName: 'Viajes Halcón',
      currentBalance: 5000,
      totalDeposited: 5000,
      totalConsumed: 0
    }
  });

  const res = await agencyService.deductIndividualReservation({
    db,
    agencyName: 'Viajes Halcón',
    amount: 320,
    reservationId: 'IND-9021',
    guestName: 'Carlos Gómez',
    hotel: 'Sercotel Guadiana',
    checkIn: '2026-11-10',
    checkOut: '2026-11-14',
    roomType: 'Doble Uso Individual',
    nights: 4,
    rooms: 1,
    notes: 'Reserva individual confirmada por email'
  });

  assert.equal(res.success, true);
  assert.equal(res.newBalance, 4680);
  assert.equal(res.movement.guestName, 'Carlos Gómez');
  assert.equal(res.movement.amount, -320);
  assert.match(res.movement.concept, /Carlos Gómez/);
  assert.match(res.movement.concept, /2026-11-10 → 2026-11-14/);

  const agencyAfter = await agencyService.getAgencyDeposit(db, 'Viajes Halcón');
  assert.equal(agencyAfter.currentBalance, 4680);
  assert.equal(agencyAfter.totalConsumed, 320);
});
