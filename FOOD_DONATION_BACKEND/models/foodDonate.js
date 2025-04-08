const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    donorContact: { type: String, required: true }, // Added contact number
    donorEmail: { type: String, required: true }, // Added email
    foodName: { type: String, required: true },
    quantity: { type: String, required: true },
    foodType: {
      type: String,
      enum: ['Vegetarian', 'Non-Vegetarian', 'Perishable', 'Non-Perishable'],
      required: true,
    },
    expiryDate: { type: Date, required: true }, // Added expiry date
    description: { type: String }, // Optional description
    location: { type: String, required: true },
    status: {
      type: String,
      enum: ['Available', 'Requested', 'Picked Up'],
      default: 'Available',
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

FoodSchema.pre('validate', function (next) {
  if (this.isModified('status')) {
    return next();
  }
  next();
});

const Food = mongoose.model('Food', FoodSchema);

module.exports = Food;
