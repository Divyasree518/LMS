const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['circulation', 'user', 'inventory', 'summary'],
    required: true
  },
  title: String,
  description: String,
  data: mongoose.Schema.Types.Mixed,
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  period: {
    startDate: Date,
    endDate: Date
  }
});

module.exports = mongoose.model('Report', reportSchema);
