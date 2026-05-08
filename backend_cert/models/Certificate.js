const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      default: "",
      trim: true,
    },
    other: {
      type: String,
      default: "",
      trim: true,
    },
    courseName: {
      type: String,
      enum: ["cert", "dip"],
      required: true,
    },
    givenDate: {
      type: String,
      required: true,
    },
    prosent: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certificate", certificateSchema);
