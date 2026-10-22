const { test } = require('node:test');
const assert = require('node:assert/strict');
const CapaSuitePricingService = require('../js/services/capaSuitePricingService');

test('CapaSuitePricingService reads exact PVP from revenueData dictionary', () => {
  CapaSuitePricingService.setCalendarData({
    revenueData: {
      '2027-09-04': {
        dateISO: '2027-09-04',
        hotels: {
          'Hotel Parque Real': { price: 0, sold: true },
          'Hotel Santa Cecilia': 66,
          'Cumbria': 71,
          'Guadiana': 75
        }
      }
    }
  });

  const priceInfo = CapaSuitePricingService.getCapaSuiteHotelDayPrice('Cumbria Spa&Hotel', '2027-09-04');
  assert.equal(priceInfo.price, 71, 'Cumbria PVP must be 71€, not fallback 92€');
  assert.equal(priceInfo.isEstimated, false, 'Should be marked as real data, not estimated');
});

test('CapaSuitePricingService handles object with price property or string with euro sign', () => {
  CapaSuitePricingService.setCalendarData({
    revenueData: {
      '2027-09-04': {
        dateISO: '2027-09-04',
        hotels: {
          'Cumbria': { price: '71 €' },
          'Guadiana': { price: 75 }
        }
      }
    }
  });

  const priceInfo = CapaSuitePricingService.getCapaSuiteHotelDayPrice('Cumbria Spa & Hotel', '2027-09-04');
  assert.equal(priceInfo.price, 71, 'String price with euro sign must parse to 71');
  assert.equal(priceInfo.isEstimated, false);
});

test('CapaSuitePricingService handles revenueData as array of date objects', () => {
  CapaSuitePricingService.setCalendarData({
    revenueData: [
      {
        dateISO: '2027-09-04',
        hotels: {
          'Cumbria': 71
        }
      }
    ]
  });

  const priceInfo = CapaSuitePricingService.getCapaSuiteHotelDayPrice('Cumbria', '2027-09-04');
  assert.equal(priceInfo.price, 71, 'Array revenueData must find 71');
  assert.equal(priceInfo.isEstimated, false);
});

test('CapaSuitePricingService handles DD/MM/YYYY date query format', () => {
  CapaSuitePricingService.setCalendarData({
    revenueData: {
      '2027-09-04': {
        hotels: {
          'Cumbria Spa&Hotel': 71
        }
      }
    }
  });

  const priceInfo = CapaSuitePricingService.getCapaSuiteHotelDayPrice('Cumbria', '04/09/2027');
  assert.equal(priceInfo.price, 71, 'Querying with DD/MM/YYYY must find 71');
  assert.equal(priceInfo.isEstimated, false);
});

test('CapaSuitePricingService does not replace a missing sale PVP with production ADR', () => {
  CapaSuitePricingService.setCalendarData({
    revenueData: {},
    hotelManagerDb: {
      cumbria: {
        '2027': {
          daily_otb: {
            '2027-09-04': {
              rooms: 6,
              revenue: 404
            }
          }
        }
      }
    }
  });

  const priceInfo = CapaSuitePricingService.getCapaSuiteHotelDayPrice('Cumbria', '2027-09-04');
  assert.equal(priceInfo.price, 0, 'Production ADR must never be passed off as sale PVP');
  assert.equal(priceInfo.unavailable, true);
  assert.equal(priceInfo.isEstimated, false);
});

 test('live PVP overrides stale copies and updates for each date and hotel', () => {
  global.window = { CapaSuiteCalendarSync: { state: { authenticated: true, data: {
    revenue_data_v2: {data:[
      {dateISO:'2027-09-04',hotels:{'Hotel Cumbria':{price:110},'Sercotel Guadiana':{price:150}},occupancyData:{Cumbria:{adr:67.33}}},
      {dateISO:'2027-09-05',hotels:{'Hotel Cumbria':{price:120}}}
    ]},custom_events:[],hotel_manager_db_v2:{}
  } } } };
  try {
    CapaSuitePricingService.setCalendarData({revenueData:{'2027-09-04':{hotels:{Cumbria:50}}}});
    assert.equal(CapaSuitePricingService.getCapaSuiteHotelDayPrice('Cumbria','2027-09-04').price,110);
    assert.equal(CapaSuitePricingService.getCapaSuiteHotelDayPrice('Guadiana','2027-09-04').price,150);
    assert.equal(CapaSuitePricingService.getCapaSuiteHotelDayPrice('Cumbria','2027-09-05').price,120);
    window.CapaSuiteCalendarSync.state.data.revenue_data_v2.data[0].hotels['Hotel Cumbria'].price=125;
    assert.equal(CapaSuitePricingService.getCapaSuiteHotelDayPrice('Cumbria','2027-09-04').price,125);
    assert.equal(CapaSuitePricingService.getCapaSuiteHotelDayPrice('Guadiana','2027-09-05').unavailable,true);
    assert.equal(CapaSuitePricingService.getDayEvents('2027-09-04').events.length,0);
    window.CapaSuiteCalendarSync.state.data=null;
    assert.equal(CapaSuitePricingService.getCapaSuiteHotelDayPrice('Cumbria','2027-09-04').unavailable,true);
  } finally { delete global.window; }
});
test('budget wires the real-time source before legacy listeners and refreshes its price UI',()=>{
  const fs=require('node:fs');
  const html=fs.readFileSync('Presupuestos.html','utf8');
  const source=fs.readFileSync('src/Presupuestos.jsx','utf8');
  assert.ok(html.indexOf('js/services/capaSuiteCalendarSync.js')<html.indexOf('js/services/groupTargetsService.js'));
  assert.ok(source.includes("window.addEventListener('capasuite-calendar-state', refresh)"));
  assert.ok(source.includes('if (window.CapaSuiteCalendarSync) return;'));
  assert.ok(source.includes('Sin PVP disponible'));
  assert.ok(!source.includes('Tarifa del hotel · media (HA)'));
});
