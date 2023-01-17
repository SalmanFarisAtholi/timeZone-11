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
    products: [
      {
        item: {
          type: Mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
        },
      },
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
