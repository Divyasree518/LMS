const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true
  },
  category: {
    type: String,
    default: 'General',
    enum: ['Fiction', 'Science', 'History', 'Computer Science', 'Biography', 'Self-Help', 'General', 'Electronics', 'Biology', 'Literature', 'Physics']
  },
  description: {
    type: String
  },
  publishedYear: {
    type: Number,
    default: new Date().getFullYear()
  },
  department: {
    type: String,
    default: 'General'
  },
  total: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  available: {
    type: Number,
    required: true,
    default: 1,
    min: 0
  },
  borrowed: {
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

module.exports = mongoose.model('Book', bookSchema);
