const router = require('express').Router();
const Stop = require('../models/stop');
const addGeo = require('../middleware/add-geolocation');
const addWeather = require('../middleware/add-weather');

router
  .post('/', addGeo(), addWeather(), (req, res, next) => {
    Stop.create(req.body)
      .then(stop => res.json(stop))
      .then()
      .catch(next);
    })

module.exports = router;