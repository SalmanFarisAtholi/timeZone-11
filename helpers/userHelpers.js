const bcrypt = require("bcrypt");
const category = require("../models/category");
const users = require("../models/userdb");
const product = require("../models/product");
const order = require("../models/order");
const Razorpay = require("razorpay");

var instance = new Razorpay({
  key_id: "rzp_test_YtBWIaL5Gbfcit",
  key_secret: "P8HtSCsSWyNPJ41Kp4eQKgfa",
});

module.exports = {
  doLogin: (userData) => {
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
  },
  getAllProduct: async (req, res) => {
    prod = await product.find({ access: true });
    return;
  },
  getAllCategorys: async (req, res) => {
    category = await category.find({ access: true });
    return;
  },
  generateRazorpay: (orderId, totalPrice) => {
    console.log(orderId);
    return new Promise((resolve, reject) => {
      var options = {
        amount: totalPrice, // amount in the smallest currency unit
        currency: "INR",
        receipt:""+orderId
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
  },
};
