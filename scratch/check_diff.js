const NexusUtils = {
    parseNum: function(v) {
        if (v === null || v === undefined || v === "") return 0;
        if (typeof v === "number") return v;
        var s = String(v).trim().replace(/[^\d.,\-]/g, "");
        if (s === "" || s === "-" || s === "---" || s === "N/A" || s === "undefined") return 0;
        var dotCount = (s.match(/\./g) || []).length;
        var commaCount = (s.match(/,/g) || []).length;
        if (dotCount > 0 && commaCount > 0) {
            if (s.lastIndexOf(",") > s.lastIndexOf(".")) {
                s = s.replace(/\./g, "").replace(",", ".");
            } else {
                s = s.replace(/,/g, "");
            }
        } else if (commaCount > 1) {
            s = s.replace(/,/g, "");
        } else if (dotCount > 1) {
            s = s.replace(/\./g, "");
        } else if (commaCount === 1) {
            if (s.split(",").pop().length === 3 && s.length > 4) s = s.replace(",", "");
            else s = s.replace(",", ".");
        } else if (dotCount === 1) {
            if (s.split(".").pop().length === 3 && s.length > 4) s = s.replace(/\./g, "");
        }
        var res = parseFloat(s);
        if (isNaN(res)) return 0;
        return res;
    }
};

const toNum = (v) => NexusUtils.parseNum(v);

const toIsoDate = (v) => {
    if (v === null || v === undefined || v === "" || v === "---") return "";
    let s = String(v).trim();
    const numericVal = parseFloat(s);
    if (!isNaN(numericVal) && numericVal > 40000 && numericVal < 60000 && !s.includes("/") && !s.includes("-")) {
      try {
        const date = new Date(Math.round((numericVal - 25569) * 86400 * 1000));
        if (!isNaN(date.getTime())) return date.toISOString().split("T")[0];
      } catch (e) {}
    }
    // ISO format YYYY-MM-DD or YYYY/MM/DD → normalize separator
    if (/^\d{4}[-\/]\d{2}[-\/]\d{2}/.test(s)) return s.substring(0, 10).replace(/\//g, "-");
    let d, m, y;
    const parts = s.split(/[-\/.]/);
    if (parts.length === 3) {
      if (parts[0].length <= 2 && parts[2].length >= 4) { d=parts[0]; m=parts[1]; y=parts[2]; }
      else if (parts[0].length <= 2) { d=parts[0]; m=parts[1]; y=parts[2]; }
      else if (parts[0].length === 4) { y=parts[0]; m=parts[1]; d=parts[2]; }
    }
    if (d && m && y) {
      let year = parseInt(y);
      if (year < 100) year += 2000;
      return `${String(year).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }
    return "";
};

const NUMERIC_KEYS = new Set(["Importe(*)", "Pax.", "Noches", "Pernoct.", "Cant. Habitaciones"]);
const DATE_KEYS = new Set(["Entrada", "Salida"]);
const relevantKeys = ["Estado", "Entrada", "Salida", "Pax.", "Importe(*)", "Régimen", "Segment.", "Nombre del Grupo", "Noches", "Pernoct.", "Empresa/Agencia", "Cant. Habitaciones"];

function testDiff(oldRow, newRow) {
    let diffType = null;
    let changes = {};

    relevantKeys.forEach((key) => {
        const rawOld = oldRow[key];
        const rawNew = newRow[key];
        if (rawNew === undefined) return;
        
        const isEmptyOld = rawOld === null || rawOld === undefined || String(rawOld).trim() === "" || String(rawOld).trim() === "---";
        const isEmptyNew = rawNew === null || rawNew === undefined || String(rawNew).trim() === "" || String(rawNew).trim() === "---";

        if (!isEmptyOld && isEmptyNew) return;
        if (isEmptyOld && isEmptyNew) return;

        let isDifferent = false;
        if (NUMERIC_KEYS.has(key)) {
            const numOld = toNum(rawOld);
            const numNew = toNum(rawNew);
            if (isNaN(numOld) && isNaN(numNew)) return;
            if (isNaN(numOld) !== isNaN(numNew)) isDifferent = Math.abs(isNaN(numOld) ? numNew : numOld) > 0.01;
            else {
                const roundedOld = Math.round(numOld * 100);
                const roundedNew = Math.round(numNew * 100);
                isDifferent = Math.abs(roundedOld - roundedNew) >= 50;
                console.log(`Numeric key ${key}: numOld=${numOld}, numNew=${numNew}, roundedOld=${roundedOld}, roundedNew=${roundedNew}, isDifferent=${isDifferent}`);
            }
        } else if (DATE_KEYS.has(key)) {
            const dateOld = toIsoDate(rawOld);
            const dateNew = toIsoDate(rawNew);
            if (dateOld === "" && dateNew === "") return;
            if (dateOld === "" || dateNew === "") return;
            isDifferent = dateOld !== dateNew;
            console.log(`Date key ${key}: dateOld=${dateOld}, dateNew=${dateNew}, isDifferent=${isDifferent}`);
        } else {
            const cleanStr = (v) => String(v).replace(/\.0$/, "").trim().toUpperCase().replace(/\s+/g, " ");
            const normalizeSegment = (s) => {
                if (s === "GRUPOS" || s === "GRUPO") return "GRUPO";
                if (s === "GRTANTEO" || s === "GRUPO TANTEO" || s === "TANTEO") return "GRUPO TANTEO";
                if (s === "DIRECTO" || s === "DIRECTO ONLINE" || s === "DIRECTO OFFLINE") return s;
                return s;
            };
            let cleanOld = isEmptyOld ? "" : cleanStr(rawOld);
            let cleanNew = isEmptyNew ? "" : cleanStr(rawNew);
            if (key === "Segment.") {
                cleanOld = normalizeSegment(cleanOld);
                cleanNew = normalizeSegment(cleanNew);
            }
            isDifferent = cleanOld !== cleanNew;
            console.log(`String key ${key}: cleanOld=${cleanOld}, cleanNew=${cleanNew}, isDifferent=${isDifferent}`);
        }

        if (isDifferent) {
            if (NUMERIC_KEYS.has(key)) {
                const cleanVal = (v) => isNaN(toNum(v)) ? String(v).trim() : Number(Math.round(toNum(v) + "e2") + "e-2").toString();
                changes[key] = { old: isEmptyOld ? "---" : cleanVal(rawOld), new: isEmptyNew ? "---" : cleanVal(rawNew) };
            } else {
                changes[key] = { old: isEmptyOld ? "---" : rawOld, new: isEmptyNew ? "---" : rawNew };
            }
        }
    });
    
    return changes;
}

const mockExisting = {
    "Importe(*)": "1234.56",
    "Pax.": "10",
    "Estado": "Confirmada",
    "Entrada": "2026-05-03",
    "Salida": "2026-05-04",
    "Segment.": "Grupo",
    "Régimen": "AD",
    "Nombre del Grupo": "Test Group",
    "Noches": "1",
    "Pernoct.": "10",
    "Empresa/Agencia": "Agencia",
    "Cant. Habitaciones": "5"
};

const mockNew = {
    "Importe(*)": 1234.56,
    "Pax.": 10,
    "Estado": "Confirmada",
    "Entrada": "03/05/2026",
    "Salida": "04/05/2026",
    "Segment.": "Grupo",
    "Régimen": "AD",
    "Nombre del Grupo": "Test Group",
    "Noches": 1,
    "Pernoct.": 10,
    "Empresa/Agencia": "Agencia",
    "Cant. Habitaciones": 5
};

console.log(testDiff(mockExisting, mockNew));

// Test what happens if the old Importe has a comma
const mockExisting2 = { ...mockExisting, "Importe(*)": "1.234,56" };
console.log("With comma in Importe(*):", testDiff(mockExisting2, mockNew));

// Test what happens if the old Importe has nothing
const mockExisting3 = { ...mockExisting, "Importe(*)": "" };
console.log("With empty Importe(*):", testDiff(mockExisting3, mockNew));

// What if Pax is string vs number
const mockExisting4 = { ...mockExisting, "Pax.": "10.0" };
console.log("With Pax. 10.0:", testDiff(mockExisting4, mockNew));
