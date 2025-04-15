const mongoose = require('mongoose');

const HealthSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  age: {
    type: Number,
    default: null
  },
  height: {
    type: Number,
    default: null
  },
  weight: {
    type: Number,
    default: null
  },
  gender: {
    type: String,
    enum: ['male', 'female', ''],
    default: ''
  },
  goalWeight: {
    type: Number,
    default: null
  },
  weeklyGoal: {
    type: String,
    default: ''
  },
  activityLevel: {
    type: String,
    default: ''
  },
  bmi: {
    type: Number,
    default: null
  },
  sleepLogs: [
    {
      date: {
        type: Date,
        default: Date.now
      },
      hours: {
        type: Number,
        default: 0
      },
      minutes: {
        type: Number,
        default: 0
      },
      totalMinutes: {
        type: Number,
        default: 0
      }
    }
  ],
  weightLogs: [
    {
      date: {
        type: Date,
        default: Date.now
      },
      weight: {
        type: Number,
        required: true
      },
      image: {
        type: String,
        default: ''
      }
    }
  ],
  dateCreated: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('health', HealthSchema); 