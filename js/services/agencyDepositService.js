/* Agency Deposit & Credit Management Service */
(function (root) {
  function normalizeAgencyKey(name) {
    if (!name || typeof name !== "string") return "";
    return name
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function roundMoney(num) {
    return Math.round((Number(num || 0) + Number.EPSILON) * 100) / 100;
  }

  async function getAgencyDeposit(db, agencyName) {
    const key = normalizeAgencyKey(agencyName);
    if (!key) return null;
    const doc = await db.collection("agency_deposits").doc(key).get();
    if (!doc.exists) {
      return {
        agencyKey: key,
        agencyName: agencyName.trim(),
        currentBalance: 0,
        totalDeposited: 0,
        totalConsumed: 0,
        exists: false
      };
    }
    const data = doc.data();
    return {
      agencyKey: key,
      agencyName: data.agencyName || agencyName.trim(),
      currentBalance: roundMoney(data.currentBalance || 0),
      totalDeposited: roundMoney(data.totalDeposited || 0),
      totalConsumed: roundMoney(data.totalConsumed || 0),
      updatedAt: data.updatedAt || null,
      exists: true
    };
  }

  async function getAllAgencyDeposits(db) {
    const snap = await db.collection("agency_deposits").get();
    const result = [];
    snap.docs.forEach((d) => {
      const data = d.data();
      result.push({
        agencyKey: d.id,
        agencyName: data.agencyName || d.id,
        currentBalance: roundMoney(data.currentBalance || 0),
        totalDeposited: roundMoney(data.totalDeposited || 0),
        totalConsumed: roundMoney(data.totalConsumed || 0),
        updatedAt: data.updatedAt || null
      });
    });
    return result.sort((a, b) => b.currentBalance - a.currentBalance);
  }

  async function getAgencyMovements(db, agencyName, limit = 100) {
    const key = normalizeAgencyKey(agencyName);
    if (!key) return [];
    const agencyRef = db.collection("agency_deposits").doc(key);
    let query = agencyRef.collection("movements");
    if (typeof query.orderBy === "function") {
      query = query.orderBy("timestamp", "desc");
    }
    if (typeof query.limit === "function" && limit > 0) {
      query = query.limit(limit);
    }
    const snap = await query.get();
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return list.sort((a, b) => String(b.timestamp || "").localeCompare(String(a.timestamp || "")));
  }

  async function registerDepositPayment({
    db,
    agencyName,
    amount,
    date,
    paymentMethod = "Transferencia",
    reference = "",
    concept = "Depósito inicial / Recarga de saldo",
    notes = "",
    createdBy = "Sistema",
    timestamp = () => new Date().toISOString()
  }) {
    const cleanAgency = (agencyName || "").trim();
    const key = normalizeAgencyKey(cleanAgency);
    if (!key) throw new Error("Debes indicar un nombre de agencia válido.");
    const numAmount = roundMoney(amount);
    if (numAmount <= 0) throw new Error("El importe del depósito debe ser mayor que 0.");

    const ts = timestamp();
    const dateStr = date || ts.split("T")[0];
    const agencyRef = db.collection("agency_deposits").doc(key);

    return db.runTransaction(async (transaction) => {
      const docSnap = await transaction.get(agencyRef);
      const existing = docSnap.exists ? docSnap.data() : null;

      const currentBal = roundMoney((existing?.currentBalance || 0) + numAmount);
      const totalDep = roundMoney((existing?.totalDeposited || 0) + numAmount);
      const totalCons = roundMoney(existing?.totalConsumed || 0);

      const agencyData = {
        agencyKey: key,
        agencyName: existing?.agencyName || cleanAgency,
        currentBalance: currentBal,
        totalDeposited: totalDep,
        totalConsumed: totalCons,
        updatedAt: ts
      };

      transaction.set(agencyRef, agencyData, { merge: true });

      const movRef = agencyRef.collection("movements").doc();
      const movementData = {
        id: movRef.id,
        type: "DEPOSIT_IN",
        amount: numAmount,
        concept: concept || "Ingreso de depósito",
        reference: reference.trim(),
        paymentMethod: paymentMethod.trim(),
        balanceAfter: currentBal,
        date: dateStr,
        timestamp: ts,
        createdBy,
        notes: notes.trim()
      };
      transaction.set(movRef, movementData);

      return {
        success: true,
        agencyKey: key,
        newBalance: currentBal,
        movement: movementData
      };
    });
  }

  /* Descontar reserva individual (habitaciones sueltas, particulares, estancias de varios días) */
  async function deductIndividualReservation({
    db,
    agencyName,
    amount,
    reservationId = "",
    guestName = "",
    hotel = "",
    checkIn = "",
    checkOut = "",
    roomType = "",
    nights = 1,
    rooms = 1,
    notes = "",
    timestamp = () => new Date().toISOString()
  }) {
    const cleanAgency = (agencyName || "").trim();
    const key = normalizeAgencyKey(cleanAgency);
    if (!key) throw new Error("Debes indicar la agencia.");
    const numAmount = roundMoney(amount);
    if (numAmount <= 0) throw new Error("El importe a descontar debe ser mayor que 0.");

    const ts = timestamp();
    const dateStr = ts.split("T")[0];
    const agencyRef = db.collection("agency_deposits").doc(key);

    return db.runTransaction(async (transaction) => {
      const agencySnap = await transaction.get(agencyRef);
      if (!agencySnap.exists) {
        throw new Error(`La agencia "${cleanAgency}" no tiene cuenta de depósito.`);
      }
      const agencyData = agencySnap.data();
      const currentBal = roundMoney(agencyData.currentBalance || 0);

      if (currentBal < numAmount) {
        throw new Error(
          `Saldo insuficiente en el depósito de ${cleanAgency}. Saldo disponible: ${currentBal.toFixed(2)} €, importe a descontar: ${numAmount.toFixed(2)} €.`
        );
      }

      const newBal = roundMoney(currentBal - numAmount);
      const newCons = roundMoney((agencyData.totalConsumed || 0) + numAmount);

      transaction.update(agencyRef, {
        currentBalance: newBal,
        totalConsumed: newCons,
        updatedAt: ts
      });

      const movRef = agencyRef.collection("movements").doc();
      const stayParts = [];
      if (checkIn && checkOut) stayParts.push(`${checkIn} → ${checkOut}`);
      else if (checkIn) stayParts.push(`Entrada: ${checkIn}`);
      if (nights && Number(nights) > 1) stayParts.push(`${nights} noches`);
      if (rooms && Number(rooms) > 1) stayParts.push(`${rooms} hab.`);
      if (roomType) stayParts.push(roomType);

      const stayDetail = stayParts.length ? ` (${stayParts.join(" · ")})` : "";
      const titular = guestName ? guestName.trim() : (reservationId ? `Reserva #${reservationId}` : "Habitación individual");
      const hotelLabel = hotel ? ` [${hotel.trim()}]` : "";

      const concept = `Habitación Indiv: ${titular}${hotelLabel}${stayDetail}`;

      const movementData = {
        id: movRef.id,
        type: "INDIVIDUAL_RESERVATION",
        isIndividual: true,
        amount: -numAmount,
        reservationId: (reservationId || "").trim(),
        guestName: (guestName || "").trim(),
        hotel: (hotel || "").trim(),
        checkIn: checkIn || "",
        checkOut: checkOut || "",
        roomType: (roomType || "").trim(),
        nights: Number(nights) || 1,
        rooms: Number(rooms) || 1,
        concept,
        balanceAfter: newBal,
        date: dateStr,
        timestamp: ts,
        notes: (notes || "").trim()
      };
      transaction.set(movRef, movementData);

      return {
        success: true,
        agencyKey: key,
        newBalance: newBal,
        movement: movementData
      };
    });
  }

  /* Descontar reserva de grupo existente en el sistema */
  async function applyDepositToReservation({
    db,
    agencyName,
    reservationId,
    amount,
    groupName = "",
    notes = "",
    timestamp = () => new Date().toISOString()
  }) {
    const cleanAgency = (agencyName || "").trim();
    const key = normalizeAgencyKey(cleanAgency);
    if (!key) throw new Error("Debes especificar la agencia.");
    const cleanResId = String(reservationId || "").trim();
    if (!cleanResId) throw new Error("Debes indicar el localizador de la reserva.");
    const numAmount = roundMoney(amount);
    if (numAmount <= 0) throw new Error("El importe a descontar debe ser mayor que 0.");

    const ts = timestamp();
    const dateStr = ts.split("T")[0];
    const agencyRef = db.collection("agency_deposits").doc(key);
    const groupRef = db.collection("groups").doc(cleanResId);

    return db.runTransaction(async (transaction) => {
      const [agencySnap, groupSnap] = await Promise.all([
        transaction.get(agencyRef),
        transaction.get(groupRef)
      ]);

      if (!agencySnap.exists) {
        throw new Error(`La agencia "${cleanAgency}" no tiene cuenta de depósito activa.`);
      }
      const agencyData = agencySnap.data();
      const currentBal = roundMoney(agencyData.currentBalance || 0);

      if (currentBal < numAmount) {
        throw new Error(
          `Saldo insuficiente en el depósito de la agencia. Saldo disponible: ${currentBal.toFixed(2)} €, importe a descontar: ${numAmount.toFixed(2)} €.`
        );
      }

      const newBal = roundMoney(currentBal - numAmount);
      const newCons = roundMoney((agencyData.totalConsumed || 0) + numAmount);

      transaction.update(agencyRef, {
        currentBalance: newBal,
        totalConsumed: newCons,
        updatedAt: ts
      });

      const groupData = groupSnap.exists ? groupSnap.data() : {};
      const resolvedGroupName = groupName || groupData.Nombre_Grupo || groupData["Nombre del Grupo"] || "";

      const movRef = agencyRef.collection("movements").doc();
      const movementData = {
        id: movRef.id,
        type: "RESERVATION_CHARGE",
        amount: -numAmount,
        reservationId: cleanResId,
        groupName: resolvedGroupName,
        concept: `Cargo a reserva ${cleanResId}${resolvedGroupName ? ` (${resolvedGroupName})` : ""}`,
        balanceAfter: newBal,
        date: dateStr,
        timestamp: ts,
        notes: notes.trim()
      };
      transaction.set(movRef, movementData);

      let prevPaid = 0;
      let newPaid = numAmount;
      if (groupSnap.exists) {
        prevPaid = roundMoney(parseFloat(groupData.Com_Pagado || 0) || 0);
        newPaid = roundMoney(prevPaid + numAmount);

        let plan = [];
        try {
          plan = JSON.parse(groupData.PaymentPlan_JSON || "[]");
          if (!Array.isArray(plan)) plan = [];
        } catch (e) {
          plan = [];
        }

        const existingPendingDeposit = plan.find(
          (p) =>
            p.status !== "Cobrado" &&
            p.status !== "Pagado" &&
            (p.label === "Depósito" || p.label === "Primer Pago" || p.label === "Depósito Inicial")
        );

        if (existingPendingDeposit && Math.abs(parseFloat(existingPendingDeposit.amount) - numAmount) < 0.05) {
          existingPendingDeposit.status = "Cobrado";
          existingPendingDeposit.paid = numAmount;
          existingPendingDeposit.paymentMethod = "Depósito Agencia";
          existingPendingDeposit.date = dateStr;
        } else {
          plan.unshift({
            id: "dep-agencia-" + Date.now(),
            label: "Cobro Depósito Agencia",
            amount: numAmount.toFixed(2),
            percent: 0,
            paid: numAmount,
            date: dateStr,
            status: "Cobrado",
            paymentMethod: "Depósito Agencia",
            notes: notes.trim()
          });
        }

        transaction.update(groupRef, {
          Com_Pagado: newPaid.toFixed(2),
          PaymentPlan_JSON: JSON.stringify(plan),
          depositDeducted: roundMoney((parseFloat(groupData.depositDeducted || 0) || 0) + numAmount),
          updatedAt: ts
        });
      }

      return {
        success: true,
        reservationId: cleanResId,
        newAgencyBalance: newBal,
        paidAdded: numAmount,
        totalPaid: newPaid,
        movement: movementData
      };
    });
  }

  async function refundDepositToAgency({
    db,
    agencyName,
    reservationId,
    amount,
    reason = "Cancelación o ajuste de reserva",
    timestamp = () => new Date().toISOString()
  }) {
    const cleanAgency = (agencyName || "").trim();
    const key = normalizeAgencyKey(cleanAgency);
    if (!key) throw new Error("Debes especificar la agencia.");
    const numAmount = roundMoney(amount);
    if (numAmount <= 0) throw new Error("El importe a reembolsar debe ser mayor que 0.");

    const ts = timestamp();
    const dateStr = ts.split("T")[0];
    const agencyRef = db.collection("agency_deposits").doc(key);
    const cleanResId = String(reservationId || "").trim();
    const groupRef = cleanResId ? db.collection("groups").doc(cleanResId) : null;

    return db.runTransaction(async (transaction) => {
      const agencySnap = await transaction.get(agencyRef);
      if (!agencySnap.exists) {
        throw new Error(`La agencia "${cleanAgency}" no tiene cuenta de depósito.`);
      }
      const agencyData = agencySnap.data();
      const currentBal = roundMoney(agencyData.currentBalance || 0);
      const newBal = roundMoney(currentBal + numAmount);
      const newCons = roundMoney(Math.max(0, (agencyData.totalConsumed || 0) - numAmount));

      transaction.update(agencyRef, {
        currentBalance: newBal,
        totalConsumed: newCons,
        updatedAt: ts
      });

      let groupSnap = null;
      let groupData = {};
      if (groupRef) {
        groupSnap = await transaction.get(groupRef);
        if (groupSnap.exists) groupData = groupSnap.data();
      }
      const resolvedGroupName = groupData.Nombre_Grupo || groupData["Nombre del Grupo"] || "";

      const movRef = agencyRef.collection("movements").doc();
      const movementData = {
        id: movRef.id,
        type: "RESERVATION_REFUND",
        amount: numAmount,
        reservationId: cleanResId,
        groupName: resolvedGroupName,
        concept: `Reintegro ${cleanResId ? `reserva ${cleanResId}` : ""}${resolvedGroupName ? ` (${resolvedGroupName})` : ""}: ${reason}`,
        balanceAfter: newBal,
        date: dateStr,
        timestamp: ts,
        reason: reason.trim()
      };
      transaction.set(movRef, movementData);

      if (groupSnap && groupSnap.exists) {
        const prevPaid = roundMoney(parseFloat(groupData.Com_Pagado || 0) || 0);
        const newPaid = roundMoney(Math.max(0, prevPaid - numAmount));

        let plan = [];
        try {
          plan = JSON.parse(groupData.PaymentPlan_JSON || "[]");
          if (!Array.isArray(plan)) plan = [];
        } catch (e) {
          plan = [];
        }

        plan.unshift({
          id: "refund-agencia-" + Date.now(),
          label: "Reintegro a Depósito Agencia",
          amount: (-numAmount).toFixed(2),
          percent: 0,
          paid: -numAmount,
          date: dateStr,
          status: "Reembolsado",
          notes: reason.trim()
        });

        transaction.update(groupRef, {
          Com_Pagado: newPaid.toFixed(2),
          PaymentPlan_JSON: JSON.stringify(plan),
          depositDeducted: roundMoney(Math.max(0, (parseFloat(groupData.depositDeducted || 0) || 0) - numAmount)),
          updatedAt: ts
        });
      }

      return {
        success: true,
        reservationId: cleanResId,
        newAgencyBalance: newBal,
        refundedAmount: numAmount,
        movement: movementData
      };
    });
  }

  const service = {
    normalizeAgencyKey,
    roundMoney,
    getAgencyDeposit,
    getAllAgencyDeposits,
    getAgencyMovements,
    registerDepositPayment,
    deductIndividualReservation,
    applyDepositToReservation,
    refundDepositToAgency
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = service;
  }
  root.AgencyDepositService = service;
})(typeof window !== "undefined" ? window : globalThis);
