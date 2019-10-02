const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('./required-types');
const { ObjectId } = Schema.Types;

const schema = new Schema({
  title: RequiredString,
  activities: [{ type: String }],
  launchDate: Date || new Date(),
  stops: [{
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
  }]
})

schema.statics = {

  addStop(id, stop) {
    return this.updateById(id, {
      $push: { stops: [stop] }
    })
    .then(tour => { return tour.stops });
  },

  removeStop(id, stopId) {
    return this.updateById(id, {
      $pull: {
        stops: { _id: stopId }
      }
    })
    .then(tour => tour.stops);
  },

  updateStopAttendance(id, stopId, attendance) {
    return this.updateOne(
      { _id: id, 'stops._id': stopId },
      {
        $set: { 'stops.$.attendance': attendance }
      }
    )
      .then(tour => tour.stops);
  }
};

module.exports = mongoose.model('Tour', schema);