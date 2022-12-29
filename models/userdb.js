const Mongoose = require("mongoose");

const userSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
  },
  access: {
    type: Boolean,
    default: true,
  },
});

module.exports = Mongoose.model("users", userSchema);
