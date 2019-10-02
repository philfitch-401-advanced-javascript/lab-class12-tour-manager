jest.mock('../../lib/services/maps-api');
jest.mock('../../lib/services/weather-api');

const request = require('../request');
const db = require('../db');
const { matchMongoId } = require('../match-helpers');
const getLocation = require('../../lib/services/maps-api');
const getForecast = require('../../lib/services/weather-api');

getLocation.mockResolvedValue({
  latitude: 45.5266975,
  longitude: -122.6880503
});

getForecast.mockResolvedValue({
  temperature: 62,
  windDirection: 'NNE',
  precipitationType: 'drizzle'
});

describe('stops api', () => {
  beforeEach(() => {
    return db.dropCollection('stops');
  });

  //POST /tours/:id/stops
  // {
  //   "address": "123 Main St"
  // }

  const stop1 = {
    address: '97209'
  };

  function postStop(stop) {
    return request
      .post('/api/stops')
      .send(stop)
      .expect(200)
      .then(({ body }) => body);
  }

  it('add a stop and get geo location and weather', () => {
    return postStop(stop1).then(stop => {
      expect(stop).toMatchInlineSnapshot(
        matchMongoId,
        `
        Object {
          "__v": 0,
          "_id": StringMatching /\\^\\[a-f\\\\d\\]\\{24\\}\\$/i,
          "attendance": 0,
          "location": Object {
            "latitude": 45.5266975,
            "longitude": -122.6880503,
          },
          "weather": Object {
            "precipitationType": "drizzle",
            "temperature": 62,
            "windDirection": "NNE",
          },
        }
      `
      );
    });
  });

  //DELETE /tours/:id/stops/:stopId

  //PUT /tours/:id/stops/:stopId/attendance
});
