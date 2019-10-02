const request = require('../request');
const db = require('../db');
const { matchMongoId } = require('../match-helpers');

describe('tours api', () => {
  beforeEach(() => {
    return Promise.all([
      db.dropCollection('tours'),
      db.dropCollection('stops')
    ]);
  });

  const tour = {
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
    return postTour(tour).then(show => {
      expect(show).toMatchInlineSnapshot(
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

  it('gets a tour by id', () => {
    return postTour(tour).then(savedTour => {
      return request
        .get(`/api/tours/${savedTour._id}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchInlineSnapshot(
            { _id: expect.any(String) },
            `
            Object {
              "__v": 0,
              "_id": Any<String>,
              "activities": Array [
                "fun",
                "music",
                "dancing",
              ],
              "launchDate": "2019-10-02T03:39:58.913Z",
              "stops": Array [],
              "title": "De-Tour",
            }
          `
          );
        });
    });
  });
});

//GET /api/tours
