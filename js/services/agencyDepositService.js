"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/* Agency Deposit & Credit Management Service */
(function (root) {
  function normalizeAgencyKey(name) {
    if (!name || typeof name !== "string") return "";
    return name.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  }
  function roundMoney(num) {
    return Math.round((Number(num || 0) + Number.EPSILON) * 100) / 100;
  }
  function getAgencyDeposit(_x, _x2) {
    return _getAgencyDeposit.apply(this, arguments);
  }
  function _getAgencyDeposit() {
    _getAgencyDeposit = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(db, agencyName) {
      var key, doc, data;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            key = normalizeAgencyKey(agencyName);
            if (key) {
              _context.n = 1;
              break;
            }
            return _context.a(2, null);
          case 1:
            _context.n = 2;
            return db.collection("agency_deposits").doc(key).get();
          case 2:
            doc = _context.v;
            if (doc.exists) {
              _context.n = 3;
              break;
            }
            return _context.a(2, {
              agencyKey: key,
              agencyName: agencyName.trim(),
              currentBalance: 0,
              totalDeposited: 0,
              totalConsumed: 0,
              exists: false
            });
          case 3:
            data = doc.data();
            return _context.a(2, {
              agencyKey: key,
              agencyName: data.agencyName || agencyName.trim(),
              currentBalance: roundMoney(data.currentBalance || 0),
              totalDeposited: roundMoney(data.totalDeposited || 0),
              totalConsumed: roundMoney(data.totalConsumed || 0),
              updatedAt: data.updatedAt || null,
              exists: true
            });
        }
      }, _callee);
    }));
    return _getAgencyDeposit.apply(this, arguments);
  }
  function getAllAgencyDeposits(_x3) {
    return _getAllAgencyDeposits.apply(this, arguments);
  }
  function _getAllAgencyDeposits() {
    _getAllAgencyDeposits = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(db) {
      var snap, result;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            _context2.n = 1;
            return db.collection("agency_deposits").get();
          case 1:
            snap = _context2.v;
            result = [];
            snap.docs.forEach(function (d) {
              var data = d.data();
              result.push({
                agencyKey: d.id,
                agencyName: data.agencyName || d.id,
                currentBalance: roundMoney(data.currentBalance || 0),
                totalDeposited: roundMoney(data.totalDeposited || 0),
                totalConsumed: roundMoney(data.totalConsumed || 0),
                updatedAt: data.updatedAt || null
              });
            });
            return _context2.a(2, result.sort(function (a, b) {
              return b.currentBalance - a.currentBalance;
            }));
        }
      }, _callee2);
    }));
    return _getAllAgencyDeposits.apply(this, arguments);
  }
  function getAgencyMovements(_x4, _x5) {
    return _getAgencyMovements.apply(this, arguments);
  }
  function _getAgencyMovements() {
    _getAgencyMovements = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(db, agencyName) {
      var limit,
        key,
        agencyRef,
        query,
        snap,
        list,
        _args3 = arguments;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            limit = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : 100;
            key = normalizeAgencyKey(agencyName);
            if (key) {
              _context3.n = 1;
              break;
            }
            return _context3.a(2, []);
          case 1:
            agencyRef = db.collection("agency_deposits").doc(key);
            query = agencyRef.collection("movements");
            if (typeof query.orderBy === "function") {
              query = query.orderBy("timestamp", "desc");
            }
            if (typeof query.limit === "function" && limit > 0) {
              query = query.limit(limit);
            }
            _context3.n = 2;
            return query.get();
          case 2:
            snap = _context3.v;
            list = snap.docs.map(function (d) {
              return _objectSpread({
                id: d.id
              }, d.data());
            });
            return _context3.a(2, list.sort(function (a, b) {
              return String(b.timestamp || "").localeCompare(String(a.timestamp || ""));
            }));
        }
      }, _callee3);
    }));
    return _getAgencyMovements.apply(this, arguments);
  }
  function registerDepositPayment(_x6) {
    return _registerDepositPayment.apply(this, arguments);
  }
  /* Descontar reserva individual (habitaciones sueltas, particulares, estancias de varios días) */
  function _registerDepositPayment() {
    _registerDepositPayment = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(_ref) {
      var db, agencyName, amount, date, _ref$paymentMethod, paymentMethod, _ref$reference, reference, _ref$concept, concept, _ref$notes, notes, _ref$createdBy, createdBy, _ref$timestamp, timestamp, cleanAgency, key, numAmount, ts, dateStr, agencyRef;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            db = _ref.db, agencyName = _ref.agencyName, amount = _ref.amount, date = _ref.date, _ref$paymentMethod = _ref.paymentMethod, paymentMethod = _ref$paymentMethod === void 0 ? "Transferencia" : _ref$paymentMethod, _ref$reference = _ref.reference, reference = _ref$reference === void 0 ? "" : _ref$reference, _ref$concept = _ref.concept, concept = _ref$concept === void 0 ? "Depósito inicial / Recarga de saldo" : _ref$concept, _ref$notes = _ref.notes, notes = _ref$notes === void 0 ? "" : _ref$notes, _ref$createdBy = _ref.createdBy, createdBy = _ref$createdBy === void 0 ? "Sistema" : _ref$createdBy, _ref$timestamp = _ref.timestamp, timestamp = _ref$timestamp === void 0 ? function () {
              return new Date().toISOString();
            } : _ref$timestamp;
            cleanAgency = (agencyName || "").trim();
            key = normalizeAgencyKey(cleanAgency);
            if (key) {
              _context5.n = 1;
              break;
            }
            throw new Error("Debes indicar un nombre de agencia válido.");
          case 1:
            numAmount = roundMoney(amount);
            if (!(numAmount <= 0)) {
              _context5.n = 2;
              break;
            }
            throw new Error("El importe del depósito debe ser mayor que 0.");
          case 2:
            ts = timestamp();
            dateStr = date || ts.split("T")[0];
            agencyRef = db.collection("agency_deposits").doc(key);
            return _context5.a(2, db.runTransaction(/*#__PURE__*/function () {
              var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(transaction) {
                var docSnap, existing, currentBal, totalDep, totalCons, agencyData, movRef, movementData;
                return _regenerator().w(function (_context4) {
                  while (1) switch (_context4.n) {
                    case 0:
                      _context4.n = 1;
                      return transaction.get(agencyRef);
                    case 1:
                      docSnap = _context4.v;
                      existing = docSnap.exists ? docSnap.data() : null;
                      currentBal = roundMoney(((existing === null || existing === void 0 ? void 0 : existing.currentBalance) || 0) + numAmount);
                      totalDep = roundMoney(((existing === null || existing === void 0 ? void 0 : existing.totalDeposited) || 0) + numAmount);
                      totalCons = roundMoney((existing === null || existing === void 0 ? void 0 : existing.totalConsumed) || 0);
                      agencyData = {
                        agencyKey: key,
                        agencyName: (existing === null || existing === void 0 ? void 0 : existing.agencyName) || cleanAgency,
                        currentBalance: currentBal,
                        totalDeposited: totalDep,
                        totalConsumed: totalCons,
                        updatedAt: ts
                      };
                      transaction.set(agencyRef, agencyData, {
                        merge: true
                      });
                      movRef = agencyRef.collection("movements").doc();
                      movementData = {
                        id: movRef.id,
                        type: "DEPOSIT_IN",
                        amount: numAmount,
                        concept: concept || "Ingreso de depósito",
                        reference: reference.trim(),
                        paymentMethod: paymentMethod.trim(),
                        balanceAfter: currentBal,
                        date: dateStr,
                        timestamp: ts,
                        createdBy: createdBy,
                        notes: notes.trim()
                      };
                      transaction.set(movRef, movementData);
                      return _context4.a(2, {
                        success: true,
                        agencyKey: key,
                        newBalance: currentBal,
                        movement: movementData
                      });
                  }
                }, _callee4);
              }));
              return function (_x0) {
                return _ref5.apply(this, arguments);
              };
            }()));
        }
      }, _callee5);
    }));
    return _registerDepositPayment.apply(this, arguments);
  }
  function deductIndividualReservation(_x7) {
    return _deductIndividualReservation.apply(this, arguments);
  }
  /* Descontar reserva de grupo existente en el sistema */
  function _deductIndividualReservation() {
    _deductIndividualReservation = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(_ref2) {
      var db, agencyName, amount, _ref2$reservationId, reservationId, _ref2$guestName, guestName, _ref2$hotel, hotel, _ref2$checkIn, checkIn, _ref2$checkOut, checkOut, _ref2$roomType, roomType, _ref2$nights, nights, _ref2$rooms, rooms, _ref2$notes, notes, _ref2$timestamp, timestamp, cleanAgency, key, numAmount, ts, dateStr, agencyRef;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.n) {
          case 0:
            db = _ref2.db, agencyName = _ref2.agencyName, amount = _ref2.amount, _ref2$reservationId = _ref2.reservationId, reservationId = _ref2$reservationId === void 0 ? "" : _ref2$reservationId, _ref2$guestName = _ref2.guestName, guestName = _ref2$guestName === void 0 ? "" : _ref2$guestName, _ref2$hotel = _ref2.hotel, hotel = _ref2$hotel === void 0 ? "" : _ref2$hotel, _ref2$checkIn = _ref2.checkIn, checkIn = _ref2$checkIn === void 0 ? "" : _ref2$checkIn, _ref2$checkOut = _ref2.checkOut, checkOut = _ref2$checkOut === void 0 ? "" : _ref2$checkOut, _ref2$roomType = _ref2.roomType, roomType = _ref2$roomType === void 0 ? "" : _ref2$roomType, _ref2$nights = _ref2.nights, nights = _ref2$nights === void 0 ? 1 : _ref2$nights, _ref2$rooms = _ref2.rooms, rooms = _ref2$rooms === void 0 ? 1 : _ref2$rooms, _ref2$notes = _ref2.notes, notes = _ref2$notes === void 0 ? "" : _ref2$notes, _ref2$timestamp = _ref2.timestamp, timestamp = _ref2$timestamp === void 0 ? function () {
              return new Date().toISOString();
            } : _ref2$timestamp;
            cleanAgency = (agencyName || "").trim();
            key = normalizeAgencyKey(cleanAgency);
            if (key) {
              _context7.n = 1;
              break;
            }
            throw new Error("Debes indicar la agencia.");
          case 1:
            numAmount = roundMoney(amount);
            if (!(numAmount <= 0)) {
              _context7.n = 2;
              break;
            }
            throw new Error("El importe a descontar debe ser mayor que 0.");
          case 2:
            ts = timestamp();
            dateStr = ts.split("T")[0];
            agencyRef = db.collection("agency_deposits").doc(key);
            return _context7.a(2, db.runTransaction(/*#__PURE__*/function () {
              var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(transaction) {
                var agencySnap, agencyData, currentBal, newBal, newCons, movRef, stayParts, stayDetail, titular, hotelLabel, concept, movementData;
                return _regenerator().w(function (_context6) {
                  while (1) switch (_context6.n) {
                    case 0:
                      _context6.n = 1;
                      return transaction.get(agencyRef);
                    case 1:
                      agencySnap = _context6.v;
                      if (agencySnap.exists) {
                        _context6.n = 2;
                        break;
                      }
                      throw new Error("La agencia \"".concat(cleanAgency, "\" no tiene cuenta de dep\xF3sito."));
                    case 2:
                      agencyData = agencySnap.data();
                      currentBal = roundMoney(agencyData.currentBalance || 0);
                      if (!(currentBal < numAmount)) {
                        _context6.n = 3;
                        break;
                      }
                      throw new Error("Saldo insuficiente en el dep\xF3sito de ".concat(cleanAgency, ". Saldo disponible: ").concat(currentBal.toFixed(2), " \u20AC, importe a descontar: ").concat(numAmount.toFixed(2), " \u20AC."));
                    case 3:
                      newBal = roundMoney(currentBal - numAmount);
                      newCons = roundMoney((agencyData.totalConsumed || 0) + numAmount);
                      transaction.update(agencyRef, {
                        currentBalance: newBal,
                        totalConsumed: newCons,
                        updatedAt: ts
                      });
                      movRef = agencyRef.collection("movements").doc();
                      stayParts = [];
                      if (checkIn && checkOut) stayParts.push("".concat(checkIn, " \u2192 ").concat(checkOut));else if (checkIn) stayParts.push("Entrada: ".concat(checkIn));
                      if (nights && Number(nights) > 1) stayParts.push("".concat(nights, " noches"));
                      if (rooms && Number(rooms) > 1) stayParts.push("".concat(rooms, " hab."));
                      if (roomType) stayParts.push(roomType);
                      stayDetail = stayParts.length ? " (".concat(stayParts.join(" · "), ")") : "";
                      titular = guestName ? guestName.trim() : reservationId ? "Reserva #".concat(reservationId) : "Habitación individual";
                      hotelLabel = hotel ? " [".concat(hotel.trim(), "]") : "";
                      concept = "Habitaci\xF3n Indiv: ".concat(titular).concat(hotelLabel).concat(stayDetail);
                      movementData = {
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
                        concept: concept,
                        balanceAfter: newBal,
                        date: dateStr,
                        timestamp: ts,
                        notes: (notes || "").trim()
                      };
                      transaction.set(movRef, movementData);
                      return _context6.a(2, {
                        success: true,
                        agencyKey: key,
                        newBalance: newBal,
                        movement: movementData
                      });
                  }
                }, _callee6);
              }));
              return function (_x1) {
                return _ref6.apply(this, arguments);
              };
            }()));
        }
      }, _callee7);
    }));
    return _deductIndividualReservation.apply(this, arguments);
  }
  function applyDepositToReservation(_x8) {
    return _applyDepositToReservation.apply(this, arguments);
  }
  function _applyDepositToReservation() {
    _applyDepositToReservation = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(_ref3) {
      var db, agencyName, reservationId, amount, _ref3$groupName, groupName, _ref3$notes, notes, _ref3$timestamp, timestamp, cleanAgency, key, cleanResId, numAmount, ts, dateStr, agencyRef, groupRef;
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.n) {
          case 0:
            db = _ref3.db, agencyName = _ref3.agencyName, reservationId = _ref3.reservationId, amount = _ref3.amount, _ref3$groupName = _ref3.groupName, groupName = _ref3$groupName === void 0 ? "" : _ref3$groupName, _ref3$notes = _ref3.notes, notes = _ref3$notes === void 0 ? "" : _ref3$notes, _ref3$timestamp = _ref3.timestamp, timestamp = _ref3$timestamp === void 0 ? function () {
              return new Date().toISOString();
            } : _ref3$timestamp;
            cleanAgency = (agencyName || "").trim();
            key = normalizeAgencyKey(cleanAgency);
            if (key) {
              _context9.n = 1;
              break;
            }
            throw new Error("Debes especificar la agencia.");
          case 1:
            cleanResId = String(reservationId || "").trim();
            if (cleanResId) {
              _context9.n = 2;
              break;
            }
            throw new Error("Debes indicar el localizador de la reserva.");
          case 2:
            numAmount = roundMoney(amount);
            if (!(numAmount <= 0)) {
              _context9.n = 3;
              break;
            }
            throw new Error("El importe a descontar debe ser mayor que 0.");
          case 3:
            ts = timestamp();
            dateStr = ts.split("T")[0];
            agencyRef = db.collection("agency_deposits").doc(key);
            groupRef = db.collection("groups").doc(cleanResId);
            return _context9.a(2, db.runTransaction(/*#__PURE__*/function () {
              var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(transaction) {
                var _yield$Promise$all, _yield$Promise$all2, agencySnap, groupSnap, agencyData, currentBal, newBal, newCons, groupData, resolvedGroupName, movRef, movementData, prevPaid, newPaid, plan, existingPendingDeposit;
                return _regenerator().w(function (_context8) {
                  while (1) switch (_context8.n) {
                    case 0:
                      _context8.n = 1;
                      return Promise.all([transaction.get(agencyRef), transaction.get(groupRef)]);
                    case 1:
                      _yield$Promise$all = _context8.v;
                      _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
                      agencySnap = _yield$Promise$all2[0];
                      groupSnap = _yield$Promise$all2[1];
                      if (agencySnap.exists) {
                        _context8.n = 2;
                        break;
                      }
                      throw new Error("La agencia \"".concat(cleanAgency, "\" no tiene cuenta de dep\xF3sito activa."));
                    case 2:
                      agencyData = agencySnap.data();
                      currentBal = roundMoney(agencyData.currentBalance || 0);
                      if (!(currentBal < numAmount)) {
                        _context8.n = 3;
                        break;
                      }
                      throw new Error("Saldo insuficiente en el dep\xF3sito de la agencia. Saldo disponible: ".concat(currentBal.toFixed(2), " \u20AC, importe a descontar: ").concat(numAmount.toFixed(2), " \u20AC."));
                    case 3:
                      // 1. Actualizar el saldo de la agencia
                      newBal = roundMoney(currentBal - numAmount);
                      newCons = roundMoney((agencyData.totalConsumed || 0) + numAmount);
                      transaction.update(agencyRef, {
                        currentBalance: newBal,
                        totalConsumed: newCons,
                        updatedAt: ts
                      });
                      groupData = groupSnap.exists ? groupSnap.data() : {};
                      resolvedGroupName = groupName || groupData.Nombre_Grupo || groupData["Nombre del Grupo"] || ""; // 2. Registrar movimiento en la agencia
                      movRef = agencyRef.collection("movements").doc();
                      movementData = {
                        id: movRef.id,
                        type: "RESERVATION_CHARGE",
                        amount: -numAmount,
                        reservationId: cleanResId,
                        groupName: resolvedGroupName,
                        concept: "Cargo a reserva ".concat(cleanResId).concat(resolvedGroupName ? " (".concat(resolvedGroupName, ")") : ""),
                        balanceAfter: newBal,
                        date: dateStr,
                        timestamp: ts,
                        notes: notes.trim()
                      };
                      transaction.set(movRef, movementData);

                      // 3. Si existe en la colección de grupos, actualizar Com_Pagado y PaymentPlan_JSON
                      prevPaid = 0;
                      newPaid = numAmount;
                      if (groupSnap.exists) {
                        prevPaid = roundMoney(parseFloat(groupData.Com_Pagado || 0) || 0);
                        newPaid = roundMoney(prevPaid + numAmount);
                        plan = [];
                        try {
                          plan = JSON.parse(groupData.PaymentPlan_JSON || "[]");
                          if (!Array.isArray(plan)) plan = [];
                        } catch (e) {
                          plan = [];
                        }
                        existingPendingDeposit = plan.find(function (p) {
                          return p.status !== "Cobrado" && p.status !== "Pagado" && (p.label === "Depósito" || p.label === "Primer Pago" || p.label === "Depósito Inicial");
                        });
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
                      return _context8.a(2, {
                        success: true,
                        reservationId: cleanResId,
                        newAgencyBalance: newBal,
                        paidAdded: numAmount,
                        totalPaid: newPaid,
                        movement: movementData
                      });
                  }
                }, _callee8);
              }));
              return function (_x10) {
                return _ref7.apply(this, arguments);
              };
            }()));
        }
      }, _callee9);
    }));
    return _applyDepositToReservation.apply(this, arguments);
  }
  function refundDepositToAgency(_x9) {
    return _refundDepositToAgency.apply(this, arguments);
  }
  function _refundDepositToAgency() {
    _refundDepositToAgency = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(_ref4) {
      var db, agencyName, reservationId, amount, _ref4$reason, reason, _ref4$timestamp, timestamp, cleanAgency, key, numAmount, ts, dateStr, agencyRef, cleanResId, groupRef;
      return _regenerator().w(function (_context1) {
        while (1) switch (_context1.n) {
          case 0:
            db = _ref4.db, agencyName = _ref4.agencyName, reservationId = _ref4.reservationId, amount = _ref4.amount, _ref4$reason = _ref4.reason, reason = _ref4$reason === void 0 ? "Cancelación o ajuste de reserva" : _ref4$reason, _ref4$timestamp = _ref4.timestamp, timestamp = _ref4$timestamp === void 0 ? function () {
              return new Date().toISOString();
            } : _ref4$timestamp;
            cleanAgency = (agencyName || "").trim();
            key = normalizeAgencyKey(cleanAgency);
            if (key) {
              _context1.n = 1;
              break;
            }
            throw new Error("Debes especificar la agencia.");
          case 1:
            numAmount = roundMoney(amount);
            if (!(numAmount <= 0)) {
              _context1.n = 2;
              break;
            }
            throw new Error("El importe a reembolsar debe ser mayor que 0.");
          case 2:
            ts = timestamp();
            dateStr = ts.split("T")[0];
            agencyRef = db.collection("agency_deposits").doc(key);
            cleanResId = String(reservationId || "").trim();
            groupRef = cleanResId ? db.collection("groups").doc(cleanResId) : null;
            return _context1.a(2, db.runTransaction(/*#__PURE__*/function () {
              var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(transaction) {
                var agencySnap, agencyData, currentBal, newBal, newCons, groupSnap, groupData, resolvedGroupName, movRef, movementData, prevPaid, newPaid, plan;
                return _regenerator().w(function (_context0) {
                  while (1) switch (_context0.n) {
                    case 0:
                      _context0.n = 1;
                      return transaction.get(agencyRef);
                    case 1:
                      agencySnap = _context0.v;
                      if (agencySnap.exists) {
                        _context0.n = 2;
                        break;
                      }
                      throw new Error("La agencia \"".concat(cleanAgency, "\" no tiene cuenta de dep\xF3sito."));
                    case 2:
                      agencyData = agencySnap.data();
                      currentBal = roundMoney(agencyData.currentBalance || 0);
                      newBal = roundMoney(currentBal + numAmount);
                      newCons = roundMoney(Math.max(0, (agencyData.totalConsumed || 0) - numAmount));
                      transaction.update(agencyRef, {
                        currentBalance: newBal,
                        totalConsumed: newCons,
                        updatedAt: ts
                      });
                      groupSnap = null;
                      groupData = {};
                      if (!groupRef) {
                        _context0.n = 4;
                        break;
                      }
                      _context0.n = 3;
                      return transaction.get(groupRef);
                    case 3:
                      groupSnap = _context0.v;
                      if (groupSnap.exists) groupData = groupSnap.data();
                    case 4:
                      resolvedGroupName = groupData.Nombre_Grupo || groupData["Nombre del Grupo"] || "";
                      movRef = agencyRef.collection("movements").doc();
                      movementData = {
                        id: movRef.id,
                        type: "RESERVATION_REFUND",
                        amount: numAmount,
                        reservationId: cleanResId,
                        groupName: resolvedGroupName,
                        concept: "Reintegro ".concat(cleanResId ? "reserva ".concat(cleanResId) : "").concat(resolvedGroupName ? " (".concat(resolvedGroupName, ")") : "", ": ").concat(reason),
                        balanceAfter: newBal,
                        date: dateStr,
                        timestamp: ts,
                        reason: reason.trim()
                      };
                      transaction.set(movRef, movementData);
                      if (groupSnap && groupSnap.exists) {
                        prevPaid = roundMoney(parseFloat(groupData.Com_Pagado || 0) || 0);
                        newPaid = roundMoney(Math.max(0, prevPaid - numAmount));
                        plan = [];
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
                      return _context0.a(2, {
                        success: true,
                        reservationId: cleanResId,
                        newAgencyBalance: newBal,
                        refundedAmount: numAmount,
                        movement: movementData
                      });
                  }
                }, _callee0);
              }));
              return function (_x11) {
                return _ref8.apply(this, arguments);
              };
            }()));
        }
      }, _callee1);
    }));
    return _refundDepositToAgency.apply(this, arguments);
  }
  var service = {
    normalizeAgencyKey: normalizeAgencyKey,
    roundMoney: roundMoney,
    getAgencyDeposit: getAgencyDeposit,
    getAllAgencyDeposits: getAllAgencyDeposits,
    getAgencyMovements: getAgencyMovements,
    registerDepositPayment: registerDepositPayment,
    deductIndividualReservation: deductIndividualReservation,
    applyDepositToReservation: applyDepositToReservation,
    refundDepositToAgency: refundDepositToAgency
  };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = service;
  }
  root.AgencyDepositService = service;
})(typeof window !== "undefined" ? window : globalThis);