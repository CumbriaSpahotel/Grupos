const fs = require('fs');
const path = 'Presupuestos.html';

let content = fs.readFileSync(path, 'utf8');

// 1. Encontrar el inicio de renderDetail
const renderDetailStart = 'const renderDetail = () => {';
const startIndex = content.indexOf(renderDetailStart);

if (startIndex === -1) {
    console.error("No se encontró renderDetail");
    process.exit(1);
}

// 2. Encontrar el final del PRIMER bloque de renderDetail
// Buscamos el final de la función que cierra el renderDetail legítimo.
// El renderDetail legítimo termina después del div de detalle y antes de la duplicación.
const legitimateEndMarker = 'return (';
const firstReturnIndex = content.indexOf(legitimateEndMarker, startIndex);
// Buscamos el cierre del bloque de return y luego el cierre de la función.
// El cierre del return es ); y el de la función es };
const endOfReturn = content.indexOf('        );', firstReturnIndex);
const endOfFunction = content.indexOf('      };', endOfReturn);

if (endOfFunction === -1) {
    console.error("No se encontró el final de la función renderDetail");
    process.exit(1);
}

const functionBodyEnd = endOfFunction + '      };'.length;

// 3. Identificar la duplicación. 
// Después de functionBodyEnd, hay un bloque de código desnudo que termina antes del return de App.
const appReturnStart = '      return (';
const appReturnIndex = content.indexOf(appReturnStart, functionBodyEnd);

if (appReturnIndex === -1) {
    console.error("No se encontró el return de App");
    process.exit(1);
}

// El bloque a eliminar es desde functionBodyEnd hasta appReturnIndex
// Pero vamos a ser más precisos.
const duplicatedBlockStart = functionBodyEnd;
const duplicatedBlockEnd = appReturnIndex;

console.log(`Eliminando bloque duplicado desde ${duplicatedBlockStart} hasta ${duplicatedBlockEnd}`);

const cleanedContent = content.substring(0, duplicatedBlockStart) + '\n\n\n' + content.substring(duplicatedBlockEnd);

// 4. Ahora vamos a re-insertar la lógica de getEffectiveClauses en el renderDetail que quedó
let finalContent = cleanedContent;
const detailLogicInsertMarker = 'const hotelName = g.Hotel_Asignado || g.Hotel || "N/A";';
const insertPos = finalContent.indexOf(detailLogicInsertMarker);

if (insertPos !== -1) {
    const afterHotelName = insertPos + detailLogicInsertMarker.length;
    const newLogic = `
        const isCumbria = hotelName.toLowerCase().includes("cumbria");
        const hotelKey = isCumbria ? 'cumbria' : 'guadiana';
        const modeKey = docMode === 'confirmacion' ? 'confirmationClauses' : 'clauses';
        const groupKey = docMode === 'confirmacion' ? 'clauses_conf' : 'clauses';

        // Lógica de Fallback Multinivel para Cláusulas
        const getEffectiveClauses = () => {
          if (g[groupKey] && g[groupKey].length > 0) return g[groupKey];
          if (globalConfig && globalConfig[hotelKey] && globalConfig[hotelKey][modeKey] && globalConfig[hotelKey][modeKey].length > 0) return globalConfig[hotelKey][modeKey];
          if (globalConfig && globalConfig.common && globalConfig.common[modeKey] && globalConfig.common[modeKey].length > 0) return globalConfig.common[modeKey];
          return docMode === 'confirmacion' ? CONF_DEFAULT_CLAUSES : BUDGET_DEFAULT_CLAUSES;
        };
        const effectiveClauses = getEffectiveClauses();
`;
    // Eliminamos la línea duplicada de isCumbria si existe justo después
    const nextLine = '        const isCumbria = hotelName.toLowerCase().includes("cumbria");';
    if (finalContent.includes(nextLine, afterHotelName)) {
        finalContent = finalContent.replace(nextLine, "");
    }
    
    finalContent = finalContent.substring(0, afterHotelName) + newLogic + finalContent.substring(afterHotelName);
}

// 5. Asegurarnos de que el render usa effectiveClauses
// Reemplazamos la lógica antigua de renderizado de cláusulas
finalContent = finalContent.replace(/\{\(\(docMode === 'presupuesto' \? tempClauses : \(\(g\.clauses && g\.clauses\.length > 0\) \? g\.clauses : BUDGET_DEFAULT_CLAUSES\)\)\.map/g, '{effectiveClauses.map');
// O el otro formato que pusimos
finalContent = finalContent.replace(/\{\(\(isEditingClauses \? tempClauses : \(\(g\.clauses && g\.clauses\.length > 0\) \? g\.clauses : BUDGET_DEFAULT_CLAUSES\)\)\)\.map/g, '{(isEditingClauses ? tempClauses : effectiveClauses).map');
finalContent = finalContent.replace(/\{\(\(isEditingClausesConf \? tempClausesConf : \(\(g\.clauses_conf && g\.clauses_conf\.length > 0\) \? g\.clauses_conf : CONF_DEFAULT_CLAUSES\)\)\)\.map/g, '{(isEditingClausesConf ? tempClausesConf : effectiveClauses).map');

fs.writeFileSync(path, finalContent);
console.log("Limpieza y actualización completada");
