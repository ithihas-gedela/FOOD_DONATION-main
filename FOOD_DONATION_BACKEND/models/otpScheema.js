const mongoose = require('mongoose');

const OtpScheema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

OtpScheema.index({ email: 1, createdAt: -1 });

const OtpModel = mongoose.model('otps', OtpScheema);

module.exports = OtpModel;
