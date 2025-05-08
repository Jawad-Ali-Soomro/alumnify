const mongoose = require('mongoose');
const { Schema } = mongoose;

const AlumniProfileSchema = new Schema({
  user_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  graduation_year: { type: Number, required: true },
  degree: { type: String, required: true },
  major: { type: String, required: true },
  current_job_title: { type: String },
  current_company: { type: String },
  industry: { type: String },
  skills: [{ type: String }],
  bio: { type: String },
  profile_picture_url: { type: String },
  linkedin_url: { type: String },
  twitter_url: { type: String },
  is_visible: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AlumniProfile', AlumniProfileSchema);