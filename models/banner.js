const Mongoose = require("mongoose");

const bannerSchema = new Mongoose.Schema({
  img: {
    type: String,
    required: true,
  },
  description: {
    type: String, 
    required: true,
  },
})
module.exports = Mongoose.model("banner", bannerSchema);
