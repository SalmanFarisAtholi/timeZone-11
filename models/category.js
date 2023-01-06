const Mongoose = require("mongoose");

const categorySchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true,
  },
  img: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  access:{
    type:Boolean,
    default:true
  }
});

module.exports = Mongoose.model("category", categorySchema);
