const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  media: [{
    image: String
  }],
  url: {
    type: String
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  category: {
    type: String,
    enum: ['general', 'tech', 'science', 'art', 'politics'],
    default: 'general'
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  likeCount: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

PostSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

PostSchema.pre('save', function(next) {
  if (this.isModified('likes')) {
    this.likeCount = this.likes.length;
  }
  next();
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;