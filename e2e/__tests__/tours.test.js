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

describe('tours api', () => {
  beforeEach(() => {
    return Promise.all([
      db.dropCollection('tours'),
      db.dropCollection('stops')
    ]);
  });

  const stop = {
    address: '97209'
  };

  const tour = {
    title: 'De-Tour',
    activities: ['fun', 'music', 'dancing'],
    launchDate: new Date(),
    stops: []
  };

  function postTour(tour) {
    return request
      .post('/api/stops')
      .send(stop)
      .expect(200)
      .then(({ body }) => {
        tour.stops[0] = body.id;
        return request
          .post('/api/tours')
          .send(tour)
          .expect(200);
      })
      .then(({ body }) => body);
  }

  it('posts a tour', () => {
    return postTour(tour).then(tour => {
      expect(tour).toMatchInlineSnapshot(
        {
          launchDate: expect.any(String),
          stops: [expect.any(Object)],
          ...matchMongoId
        },
        `
        Object {
          "__v": 0,
          "_id": StringMatching /\\^\\[a-f\\\\d\\]\\{24\\}\\$/i,
          "activities": Array [
            "fun",
            "music",
            "dancing",
          ],
          "launchDate": Any<String>,
          "stops": Array [
            Any<Object>,
          ],
          "title": "De-Tour",
        }
        `
      );
    });
  });

  it('gets a tour by id', () => {
    return postTour(tour).then(savedTour => {
      return request
        .get(`/api/tours/${savedTour._id}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchInlineSnapshot(
            {
              launchDate: expect.any(String),
              stops: [expect.any(Object)],
              ...matchMongoId
            },
            `
            Object {
              "__v": 0,
              "_id": StringMatching /\\^\\[a-f\\\\d\\]\\{24\\}\\$/i,
              "activities": Array [
                "fun",
                "music",
                "dancing",
              ],
              "launchDate": Any<String>,
              "stops": Array [
                Any<Object>,
              ],
              "title": "De-Tour",
            }
            `
          );
        });
    });
  });
});

//GET /api/tours
