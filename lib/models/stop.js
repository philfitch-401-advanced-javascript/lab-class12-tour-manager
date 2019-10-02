const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  location: {
    latitude: Number,
    longitude: Number
  },
  weather: {
    temperature: Number,
    windDirection: String,
    precipitationType: String
  },
  attendance: {
    type: Number,
    default: 0
  }
})


module.exports = mongoose.model('Stop', schema);