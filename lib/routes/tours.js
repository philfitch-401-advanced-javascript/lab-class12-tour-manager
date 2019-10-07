const router = require('express').Router();
const Tour = require('../models/tour');
const addGeo = require('../middleware/add-geolocation');
const addWeather = require('../middleware/add-weather');

router
  .post('/', (req, res, next) => {
    Tour.create(req.body)
      .then(tour => res.json(tour))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Tour.findById(req.params.id)
      .populate('Stop', 'location type')
      .populate('Stop', 'weather type')
      .then(tour => res.json(tour))
      .catch(next);
  })

  .post('/:id/stops', addGeo(), addWeather(), ({ params, body }, res, next) => {
    Tour.addStop(params.id, body)
      .then(stop => res.json(stop))
      .catch(next);
  })

  .delete('/:id/stops/:stopsId', ({ params }, res, next) => {
    Tour.removeStop(params.id, params.stopsId)
      .then(stops => res.json(stops))
      .catch(next);
  });

  module.exports = router;