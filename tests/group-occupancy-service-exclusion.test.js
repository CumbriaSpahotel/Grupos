const test = require("node:test");
const assert = require("node:assert/strict");

// Load GroupOccupancyService in Node environment
const GroupOccupancyService = require("../js/services/groupOccupancyService.js");

test("calculateDailyOccupancyMatrix does not sum non-accommodation service lines into daily bed pax", () => {
  const rawLines = [
    {
      Reserva: "206937",
      "Nombre del Grupo": "ROMANSINUES@HOTMAIL.COM",
      Entrada: "19/10/2026",
      Salida: "23/10/2026",
      "Pax.": "61",
      Noches: "4",
      Régimen: "HD",
      Descripción: "HABITACIONES GRUPO"
    },
    {
      Reserva: "206937",
      "Nombre del Grupo": "ROMANSINUES@HOTMAIL.COM",
      Entrada: "19/10/2026",
      Salida: "23/10/2026",
      "Pax.": "20",
      Noches: "4",
      Régimen: "HD",
      Descripción: "ALMUERZO EXTRAORDINARIO DIA 19"
    }
  ];

  const matrix = GroupOccupancyService.calculateDailyOccupancyMatrix(rawLines, {});
  const day19 = matrix.find(m => m.reserva === "206937" && m.fecha === "2026-10-19");

  assert.ok(day19, "Must generate entry for 2026-10-19");
  assert.equal(day19.pax, 61, "Daily accommodation pax must be 61, not 81");
});

test("calculateDailyOccupancyMatrix synchronizes daily pax with rooming list at reservation level", () => {
  const roomingList = JSON.stringify([
    { type: "INDIVIDUAL", qty: 3, pax: 1, dateIn: "2026-10-19", dateOut: "2026-10-23" },
    { type: "DOBLE", qty: 26, pax: 2, dateIn: "2026-10-19", dateOut: "2026-10-23" },
    { type: "TRIPLE", qty: 2, pax: 3, dateIn: "2026-10-19", dateOut: "2026-10-23" }
  ]);

  const rawLines = [
    {
      Reserva: "206937",
      "Nombre del Grupo": "ROMANSINUES@HOTMAIL.COM",
      Entrada: "19/10/2026",
      Salida: "23/10/2026",
      "Pax.": "81", // e.g. Excel had 81 or inflated pax
      Noches: "4",
      Régimen: "HD",
      RoomingList_JSON: roomingList
    }
  ];

  const matrix = GroupOccupancyService.calculateDailyOccupancyMatrix(rawLines, {});
  const day19 = matrix.find(m => m.reserva === "206937" && m.fecha === "2026-10-19");

  assert.ok(day19);
  assert.equal(day19.pax, 61, "Should sync with rooming list: 3*1 + 26*2 + 2*3 = 61 Pax");
  assert.equal(day19.individuales, 3);
  assert.equal(day19.dobles, 26);
  assert.equal(day19.triples, 2);
  assert.equal(day19.totalHabitaciones, 31);
});
