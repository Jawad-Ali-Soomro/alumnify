const mongoose = require('mongoose');
const { Schema } = mongoose;

const EventRegistrationSchema = new Schema({
  event_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  user_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  registration_date: { type: Date, default: Date.now },
  attendance_status: { 
    type: String, 
    enum: ['registered', 'attended', 'cancelled'], 
    default: 'registered' 
  }
});

EventRegistrationSchema.index({ event_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('EventRegistration', EventRegistrationSchema);