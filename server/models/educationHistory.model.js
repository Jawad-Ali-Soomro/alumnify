const mongoose = require('mongoose');
const { Schema } = mongoose;

const EducationHistorySchema = new Schema({
  user_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  institution_name: { type: String, required: true },
  degree: { type: String, required: true },
  field_of_study: { type: String, required: true },
  start_year: { type: Number, required: true },
  end_year: { type: Number },
  gpa: { type: Number },
  description: { type: String }
});

module.exports = mongoose.model('EducationHistory', EducationHistorySchema);