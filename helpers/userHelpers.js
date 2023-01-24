const bcrypt = require("bcrypt");
const category = require("../models/category");
const users = require("../models/userdb");
const product = require("../models/product");
const order = require("../models/order");
const Razorpay = require("razorpay");
const { resolve } = require("path");

var instance = new Razorpay({
  key_id: "rzp_test_YtBWIaL5Gbfcit",
  key_secret: "P8HtSCsSWyNPJ41Kp4eQKgfa",
});

module.exports = {
  doLogin: (userData) => {
    try {
      return new Promise(async (resolve, reject) => {
        let response = {};
        let user = await users.findOne({ email: userData.email });
        if (user && user.access) {
          bcrypt.compare(userData.password, user.password).then((status) => {
            if (status) {
              console.log("LOGIN SUCCESS.");
              response.user = user;
              response.status = true;
              resolve(response);
            } else {
              console.log("LOGIN FAILED.");
              resolve({ status: false });
            }
          });
        } else {
          console.log("Login Failed.");
          resolve({ status: false });
        }
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getAllProduct: async (req, res) => {
    try {
      prod = await product.find({ access: true });
      return;
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getAllCategorys: async (req, res) => {
    try {
      category = await category.find({ access: true });
      return;
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  generateRazorpay: (orderId, totalPrice) => {
    try {
      console.log(orderId);
      return new Promise((resolve, reject) => {
        var options = {
          amount: totalPrice * 100, // amount in the smallest currency unit
          currency: "INR",
          receipt: "" + orderId,
        };
        instance.orders.create(options, function (err, order) {
          if (err) {
            console.log(err);
          } else {
            console.log("New Order", order);
            resolve(order);
          }
        });
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  verifyPayment: (detailes) => {
    try {
      return new Promise((resolve, reject) => {
        var crypto = require("crypto");

        var hmac = crypto.createHmac("sha256", "P8HtSCsSWyNPJ41Kp4eQKgfa");
        hmac.update(
          detailes.payment.razorpay_order_id +
            "|" +
            detailes.payment.razorpay_payment_id
        );
        hmac = hmac.digest("hex");
        if (hmac == detailes.payment.razorpay_signature) {
          resolve();
        } else {
          reject();
        }
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  changePaymentStatus: (orderId) => {
    try {
      console.log(orderId + "koi");
      return new Promise((resolve, reject) => {
        console.log("Status Change running");
        order
          .findByIdAndUpdate({ _id: orderId }, { $set: { status: "Placed" } })
          .then(() => {
            console.log("Database changed");
            resolve();
          });
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
