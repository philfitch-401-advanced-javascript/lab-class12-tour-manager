const request = require('../request');
const db = require('../db');
const { matchMongoId } = require('../match-helpers');

//POST /api/tours
describe('tours api', () => {
  beforeEach(() => {
    return Promise.all([
      db.dropCollection('tours'),
      db.dropCollection('stops')
    ]);
  });

  const tour = {
    title: 'De-Tour',
    activities: [],
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
          "activities": Array [],
          "launchDate": Any<String>,
          "stops": Array [],
          "title": "De-Tour",
        }
      `
      );
    });
  });
});

//GET /api/tours
