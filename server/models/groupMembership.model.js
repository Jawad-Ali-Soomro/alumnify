const mongoose = require('mongoose');
const { Schema } = mongoose;

const GroupMembershipSchema = new Schema({
  group_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'Group', 
    required: true 
  },
  user_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  join_date: { type: Date, default: Date.now },
  role: { 
    type: String, 
    enum: ['member', 'admin', 'moderator'], 
    default: 'member' 
  }
});

GroupMembershipSchema.index({ group_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('GroupMembership', GroupMembershipSchema);