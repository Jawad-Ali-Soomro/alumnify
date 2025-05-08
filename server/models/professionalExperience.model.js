const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProfessionalExperienceSchema = new Schema({
  user_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  job_title: { type: String, required: true },
  company: { type: String, required: true },
  industry: { type: String },
  location: { type: String },
  start_date: { type: Date, required: true },
  end_date: { type: Date },
  current_job: { type: Boolean, default: false },
  description: { type: String }
});

module.exports = mongoose.model('ProfessionalExperience', ProfessionalExperienceSchema);