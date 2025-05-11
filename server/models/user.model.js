const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: { 
    type: String, 
    required: true,
    minlength: 8,
    select: false
  },
  username: { type: String, required: true, trim: true },
  avatar: {
    type: String,
    default: ""
  },
  role: { 
    type: String, 
    required: true, 
    enum: ['admin', 'user'], 
    default: 'user' 
  },
  bio: {
    type: String,
    default: ""
  },
  account_status: { 
    type: String, 
    enum: ['active', 'suspended', 'deactivated'], 
    default: 'active' 
  },
  phone: {
    type: Number,
    default: null
  },
  field : {
    type: String,
    default: ""
  },
  company: {
    type: String,
    default: ""
  },
  university: {
    type: String,
    default: ""
  },
  graduationYear: {
    type: Number,
    default: null
  },

  last_login: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  friends: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
});

UserSchema.pre('save', function(next) {
  const user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  if (typeof cb !== 'function') {
    return bcrypt.compare(candidatePassword, this.password);
  }
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const User = mongoose.model('User', UserSchema);
module.exports = User;