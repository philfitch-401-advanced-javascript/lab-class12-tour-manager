jest.mock('../../lib/services/maps-api');
jest.mock('../../lib/services/weather-api');

const request = require('../request');
const db = require('../db');
const { matchMongoId } = require('../match-helpers');
const getLocation = require('../../lib/services/maps-api');
const getWeather = require('../../lib/services/weather-api');

getLocation.mockResolvedValue({
  latitude: 45.5266975,
  longitude: -122.6880503
});

getWeather.mockResolvedValue({
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

  const tour1 = {
    title: 'De-Tour',
    activities: ['fun', 'music', 'dancing'],
    launchDate: new Date(),
    stops: []
  };

  function postTour(tour) {
    return request
      .post('/api/tours')
      .send(tour)
      .expect(200)
      .then(({ body }) => body);
  }

  it('posts a tour', () => {

    return postTour(tour1).then(tour => {
      expect(tour).toMatchInlineSnapshot(
        {
          launchDate: expect.any(String),
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
          "stops": Array [],
          "title": "De-Tour",
        }
      `
      );
    });
  });

  const stop1 = { address: '97209' };

  function postTourWithStop(tour, stop) {
    return postTour(tour)
      .then(tour => {
        return request
          .post(`/api/tours/${tour._id}/stops`)
          .send(stop)
          .expect(200)
          .then(({ body }) => [tour, body]);
      });
  }

  it('adds a stop to a tour', () => {

    return postTourWithStop(tour1, stop1)
      .then(([, stops]) => {
        expect(stops[0]).toEqual ({
          ...matchMongoId,
          attendance: 0,
          location: {
            latitude: 45.5266975,
            longitude: -122.6880503  
          },
          weather: {
            temperature: 62,
            windDirection: 'NNE',
            precipitationType: 'drizzle'
          }
        });
      });
  });

  it.skip('removes a stop', () => {

    return postTourWithStop(tour1, stop1)
      .then(([tour, stops]) => {
        return request
          .delete(`/api/tours/${tour._id}/stops/${stops[0]._id}`)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(0);
      });
  });

  it('gets a tour by id', () => {

    return postTour(tour1).then(savedTour => {
      return request
        .get(`/api/tours/${savedTour._id}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchInlineSnapshot(
            {
              launchDate: expect.any(String),
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
              "stops": Array [],
              "title": "De-Tour",
            }
          `
          );
        });
    });
  });


});
