const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const utils = require('../js/utils');
const pricing = require('../js/services/capaSuitePricingService');
const dates = utils.getStayDates({Entrada:'2026-11-05',Salida:'2026-11-08',DateRanges_JSON:[{in:'2026-10-05',out:'2026-10-06'}]});

test('visible dates override a stale single imported range; real series keep their gaps', () => {
  assert.deepEqual(dates, ['2026-11-05','2026-11-06','2026-11-07']);
  assert.deepEqual(utils.getStayDates({isMultiSegment:true,segments:[{in:'2026-11-05',out:'2026-11-06'},{in:'2026-11-09',out:'2026-11-10'}]}),['2026-11-05','2026-11-09']);
  assert.equal(utils.getStayDates({DateRanges_JSON:[{in:'2026-11-05',out:'2026-11-06'},{in:'2026-11-09',out:'2026-11-10'}]}).length,2);
});

test('three occupied nights feed PVP, discount and stay average; changing hotel and live prices recalculates', () => {
  function load(extra=0) { pricing.setCalendarData({revenueData:Object.fromEntries(dates.map((d,i)=>[d,{hotels:{Guadiana:{price:100+i*20+extra},Cumbria:{price:80+i*20}}}]))}); }
  load();
  const grid={HA:{DOBLE:65,'DOBLE DE USO INDIVIDUAL':65}};
  const summary=pricing.getStayTariffSummary('Guadiana',dates,'HA',15,grid);
  assert.equal(summary.nightsCount,3);
  assert.equal(summary.avgHotelPrice,120);
  assert.equal(summary.avgRecommendedRate,102);
  assert.equal(pricing.getStayTariffSummary('Cumbria',dates,'HA',15,grid).avgRecommendedRate,85);
  load(20);
  assert.equal(pricing.getStayTariffSummary('Guadiana',dates,'HA',15,grid).avgRecommendedRate,119);
  assert.equal(pricing.getCapaSuiteHotelDayPrice('Guadiana','2026-11-08').status,'missing');
});

test('sale-price normalization and unavailability reasons never invent a price or hotel', () => {
  for (const raw of ['1.234,50 €','1,234.50 EUR',1234.5]) assert.equal(pricing.resolveDayPrice('Guadiana','2026-11-05',{hotels:{Guadiana:{price:raw}}}).price,1234.5);
  assert.equal(pricing.resolveDayPrice('Guadiana','2026-11-05',{hotels:{Guadiana:{price:100,soldOut:true}}}).status,'sold-out');
  assert.equal(pricing.resolveDayPrice('Other','2026-11-05',{hotels:{Guadiana:100}}).status,'unknown-hotel');
  assert.equal(pricing.resolveDayPrice('Cumbria','2026-11-05',{price:100}).status,'missing');
});

test('calendar cells and budget use live prices even with stale rendered day data; loading is explicit', () => {
  const state={authenticated:true,data:null};
  const context={window:{CapaSuiteCalendarSync:{state},addEventListener(){}},self:{},console};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('js/services/capaSuitePricingService.js','utf8'),context);
  const service=context.window.CapaSuitePricingService=context.self.CapaSuitePricingService;
  assert.equal(service.getCapaSuiteHotelDayPrice('Guadiana','2026-11-05').status,'loading');
  const html=fs.readFileSync('Calendario.html','utf8');
  vm.runInContext(html.slice(html.indexOf('            function getDayPriceMetrics('),html.indexOf('            // Carga y')),context);
  state.data={revenue_data_v2:{'2026-11-05':{hotels:{Guadiana:{price:'140,50 €'}}}}};
  assert.equal(context.getDayPriceMetrics('2026-11-05',{hotels:{Guadiana:50}},'Guadiana').hotelPrice,140.5);
  state.data={revenue_data_v2:{'2026-11-05':{hotels:{Guadiana:{price:160}}}}};
  assert.equal(context.getDayPriceMetrics('2026-11-05',{},'Guadiana').hotelPrice,160);
});
