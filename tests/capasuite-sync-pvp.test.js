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

test('CapaSuitePricingService calculates ADR from hotelManagerDb rooms and revenue if price is missing', () => {
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
  assert.equal(priceInfo.price, 67.33, 'Should compute 404 / 6 = 67.33 from production OTB');
  assert.equal(priceInfo.isEstimated, false);
});
