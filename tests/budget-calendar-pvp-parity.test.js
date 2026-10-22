const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');
const source = fs.readFileSync('js/services/capaSuitePricingService.js', 'utf8');
const html = fs.readFileSync('Calendario.html', 'utf8');
const start = html.indexOf('            function getDayPriceMetrics(');
const end = html.indexOf('            // Carga y', start);
const day = {dateISO:'2026-12-05', hotels:{Cumbria:{price:110},Guadiana:{price:115}}, occupancyData:{Guadiana:{adr:69}}};
function evaluate(authenticated) {
  const context={window:{CapaSuiteCalendarSync:{state:{authenticated,data:authenticated?{revenue_data_v2:{data:[day]}}:null}},addEventListener(){}},self:{},console,
    localStorage:{getItem:key=>key==='v3_revenue_data_v2'?JSON.stringify({data:[day]}):null}};
  vm.createContext(context);
  vm.runInContext(source,context);
  vm.runInContext(html.slice(start,end),context);
  return {context,service:context.self.CapaSuitePricingService};
}
for (const authenticated of [false,true]) {
  test(`budget and Groups calendar use the same December 5 sale PVP (${authenticated?'live data':'saved calendar during session restoration'})`,()=>{
    const {context,service}=evaluate(authenticated);
    const expected=context.getDayPriceMetrics('2026-12-05',day,'Guadiana').hotelPrice;
    assert.equal(expected,115);
    assert.equal(service.getCapaSuiteHotelDayPrice('Sercotel Guadiana','05/12/2026').price,expected);
    assert.notEqual(expected,day.occupancyData.Guadiana.adr);
  });
}
