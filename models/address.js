const Mongoose = require("mongoose");
const addressSchema = new Mongoose.Schema({
  address: {
    type: [
      {
        fName: {
          type: String,
        },
        lName: {
          type: String,
        },
        mob: {
          type: Number,
        },
        house: {
          type: String,
        },
        landmark: {
          type: String,
        },
        city: {
          type: String,
        },
        district: {
          type: String,
        },
        state: {
          type: String,
        },
        pincode: {
          type: Number,
        },
        status: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  userId: {
    type: String,
    ref: "user",
  },
});
module.exports = Mongoose.model("address", addressSchema);
