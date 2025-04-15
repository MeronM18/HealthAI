const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  mealType: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'drinks', 'daily']
  },
  foodItems: [{
    name: {
      type: String,
      required: true
    },
    servingInfo: {
      type: String,
      required: true
    },
    calories: {
      type: Number,
      required: true
    },
    protein: {
      type: Number,
      required: true
    },
    carbs: {
      type: Number,
      required: true
    },
    fats: {
      type: Number,
      required: true
    }
  }],
  totalCalories: {
    type: Number,
    required: true
  },
  totalProtein: {
    type: Number,
    required: true
  },
  totalCarbs: {
    type: Number,
    required: true
  },
  totalFats: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

//Create compound index for efficient querying by user and date
MealSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('meal', MealSchema);
