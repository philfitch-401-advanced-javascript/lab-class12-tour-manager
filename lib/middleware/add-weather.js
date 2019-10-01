const getWeather = require('../services/weather-api');

module.exports = () => (req, res, next) => {
  const{ location } = req.body;

  if(!location) {
    return next({
      statusCode: 400,
      error: 'location must be supplied'
    });
  }

  getWeather(location)
    .then(weather => {
      if(!weather) {
        throw {
          statusCode: 400,
          error: 'location must be resolvable to weather'
        };
      }
      req.body.weather = weather;
      next();
    })
    .catch(next);
};
