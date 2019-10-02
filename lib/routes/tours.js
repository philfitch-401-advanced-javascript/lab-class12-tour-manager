const router = require('express').Router();
const Tour = require('../models/tour');

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
  });

  module.exports = router;