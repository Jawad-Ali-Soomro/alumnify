const mongoose = require('mongoose');
const { Schema } = mongoose;

const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  start_datetime: { type: Date, required: true },
  end_datetime: { type: Date, required: true },
  location: { type: String },
  virtual_link: { type: String },
  created_by: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  created_at: { type: Date, default: Date.now },
  max_attendees: { type: Number },
  is_public: { type: Boolean, default: true },
  registration_deadline: { type: Date }
});

module.exports = mongoose.model('Event', EventSchema);