const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/,
      lowercase: true, 
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create an index on the email field for faster queries
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);
