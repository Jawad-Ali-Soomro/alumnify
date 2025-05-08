const mongoose = require('mongoose');
const { Schema } = mongoose;

const GroupSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  created_by: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  created_at: { type: Date, default: Date.now },
  is_public: { type: Boolean, default: true },
  category: { 
    type: String, 
    enum: ['professional', 'regional', 'interest', 'academic'], 
    default: 'professional' 
  }
});

module.exports = mongoose.model('Group', GroupSchema);