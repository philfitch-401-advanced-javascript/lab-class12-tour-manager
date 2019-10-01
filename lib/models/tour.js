const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('./required-types');
const { ObjectId } = Schema.Types;

const schema = new Schema({
  title: RequiredString,
  activities: [{ type: String }],
  launchDate: Date || new Date(),
  stops: [{
    stop: {
      type: ObjectId,
      ref: 'Stop'
    }
  }]
})

schema.statics = {

  addStop(id, stop) {
    return this.updateById(id, {
      $push: { stops: stop }
    })
    .then(tour => tour.stops);
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