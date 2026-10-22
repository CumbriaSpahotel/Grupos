(function () {
    'use strict';
    var session, ready, stopData, generation = 0, retryTimer, retryDelay = 5000;
    var state = { status: 'Conectando con CapaSuite...', connected: false, authenticated: false, data: null, updatedAt: null };
    var stores = { compData: 'revenue_data_v2', hotelData: 'hotel_manager_db_v2', customEvents: 'custom_events', manualCupos: 'manual_cupos_v1' };

    function notify() {
        window.dispatchEvent(new CustomEvent('capasuite-calendar-state', { detail: state }));
    }
    function apply(snapshot, version) {
        if (version !== generation) return;
        try {
            var raw = snapshot.val();
            if (!raw || raw.compData == null) throw new Error('Sin calendario');
            var values = {};
            Object.keys(stores).forEach(function (field) {
                var value = raw[field];
                values[stores[field]] = value == null ? (field === 'customEvents' ? [] : {}) : typeof value === 'string' ? JSON.parse(value) : value;
            });
            var revenue = values.revenue_data_v2;
            if (!revenue || typeof revenue !== 'object' || !Array.isArray(values.custom_events)) throw new Error('Formato de calendario no válido');
            state.data = values;
            state.updatedAt = new Date();
            state.status = state.connected ? 'CapaSuite actualizado' : 'CapaSuite: datos guardados, sin conexión';
            // Memory is authoritative; storage is an optional offline copy.
            Object.keys(values).forEach(function (key) {
                try { localStorage.setItem('v3_' + key, JSON.stringify(values[key])); } catch (error) {}
            });
            notify();
        } catch (error) {
            state.status = 'CapaSuite: no se pudo leer el calendario';
            notify();
        }
    }
    function start() {
        if (ready) return ready;
        ready = import('./capaSuiteSession.mjs?v=1').then(function (sdk) {
            session = sdk.createSession();
            retryDelay = 5000;
            session.observeConnection(function (connected) {
                state.connected = connected;
                if (state.authenticated) state.status = connected ? (state.data ? 'CapaSuite actualizado' : 'Recibiendo calendario de CapaSuite...') : 'CapaSuite sin conexión';
                notify();
            });
            return new Promise(function (resolve, reject) {
                session.observeAuth(function (user) {
                    generation++;
                    if (stopData) stopData();
                    state.authenticated = !!user;
                    state.data = null;
                    state.updatedAt = null;
                    state.uid = user ? user.uid : null;
                    state.status = user ? 'Recibiendo calendario de CapaSuite...' : 'CapaSuite: inicia sesión para sincronizar';
                    notify();
                    if (user) {
                        var version = generation;
                        stopData = session.listen(user.uid, function (snapshot) { apply(snapshot, version); }, function () {
                            if (version !== generation) return;
                            state.status = 'Error de acceso al calendario de CapaSuite';
                            notify();
                        });
                    }
                    resolve();
                }, reject);
            });
        }).catch(function (error) {
            ready = null;
            state.status = 'No se pudo conectar con CapaSuite';
            notify();
            if (!retryTimer) {
                retryTimer = setTimeout(function () {
                    retryTimer = null;
                    start().catch(function () {});
                }, retryDelay);
                retryDelay = Math.min(retryDelay * 2, 60000);
            }
            throw error;
        });
        return ready;
    }
    window.CapaSuiteCalendarSync = {
        state: state,
        start: start,
        signIn: async function (email, password) { await start(); return session.signIn(email, password); },
        refresh: async function () {
            await start();
            if (!state.uid) return false;
            var version = generation;
            var snapshot = await session.read(state.uid);
            apply(snapshot, version);
            return true;
        }
    };
    window.addEventListener('load', function () { start().catch(function () {}); });
    window.addEventListener('online', function () {
        window.CapaSuiteCalendarSync.refresh().catch(function () {
            state.status = 'No se pudo actualizar CapaSuite';
            notify();
        });
    });
    window.addEventListener('focus', function () {
        window.CapaSuiteCalendarSync.refresh().catch(function () {});
    });
})();
