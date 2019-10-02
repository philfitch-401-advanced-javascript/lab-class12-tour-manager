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

  const performance = {
    location: {
      latitude: 45.5266975,
      longitude: -122.6880503
    },
    weather: {
      temperature: 62,
      windDirection: 'NNE',
      precipitationType: 'drizzle'
    },
    attendance: 50
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
      .send(performance)
      .expect(200)
      .then(({ body }) => {
        tour.stops[0] = body.id;
        return request
          .post('/api/tours')
          .send(tour)
          .expect(200)
        })
        .then(({ body }) => body);
  }

  it('posts a tour', () => {
    return postTour(tour).then(tour => {
      expect(tour).toMatchInlineSnapshot(
        {
          launchDate: expect.any(String),
          stops: [expect.any(String)],
          ...matchMongoId
        },
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
          );
        });
    });
  });
});

//GET /api/tours
