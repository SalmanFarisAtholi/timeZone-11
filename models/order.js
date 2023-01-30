const Mongoose = require("mongoose");

const orderSchema = new Mongoose.Schema(
  {
    userId: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "user",
      // required:true,
    },
    date: {
      type: String,
    },
    total: {
      type: Number,
    },
    payment: {
      type: String,
    },
    address: { 
      type: String,
      // required: true,
    },
    products:[
      {
        productId: {
          type: Mongoose.Types.ObjectId,
          ref: "product",
          // re=quired: true
        },
        qty: {
          type: Number,
          // required: true
        }
      }
    ],
    status: {
      type: String, 
    },
    // discountCoupon: {
    //   type: Mongoose.Schema.Types.ObjectId,
    //   ref: 'Coupon',
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = Mongoose.model("order", orderSchema);
