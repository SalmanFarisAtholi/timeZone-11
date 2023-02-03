const bcrypt = require("bcrypt");
const { response } = require("express");
const userHelpers = require("../helpers/user-helpers");
const users = require("../models/userdb");
const product = require("../models/product");
const wishlist = require("../models/wishlist");
const address = require("../models/address");
const { data } = require("jquery");
const order = require("../models/order");
const category = require("../models/category");
const { sendotp, verifyotp } = require("../uttilities/otp");
const banner=require("../models/banner")

module.exports = {
  signup: (req, res, next) => {
    try {
      res.render("user/signup");
    } catch (e) {
      next(e);
    }
  },
  index:  async (req, res) => {
    const b = await banner.find()
      const ban=b[0]
    res.render("index",{ban});
  },
  login: (req, res) => {
    if (req.session.loggedIn) {
      res.redirect("/home");
    } else {
      res.render("user/login");
    }
  },
  home: async (req, res, next) => {
    try {
      const b = await banner.find()
      const ban=b[0]
      const products = await product.find({ access: true });
      res.render("user/home", { products,ban});
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  shop: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const itemsPerPage = 9;
      const totalproducts = await product.find().countDocuments();
      const produc = await product
        .find({})
        .populate("category", "title")
        .lean()
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
      const userId = req.session.id;
      const type = await category.find();
      res.render("user/shop", {
        login: true,
        user: req.session.user,
        produc,
        userId,
        type,
        page,
        hasNextPage: itemsPerPage * page < totalproducts,
        hasPreviousPage: page > 1,
        PreviousPage: page - 1,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  sign: async (req, res, next) => {
    try {
      let mob = req.body.mobile;
      const pass = await bcrypt.hash(req.body.password, 10);
      const conPass = await bcrypt.hash(req.body.confirmPassword, 10);
      console.log(req.body);
      const user = new users({
        name: req.body.name,
        password: pass,
        confirmPassword: conPass,
        mobile: req.body.mobile,
        email: req.body.email,
      });
      user.save((error, doc) => {
        if (error) {
          console.log(error);
        } else {
          console.log(doc);
        }
      });
      res.redirect("/login");
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  postLogin: (req, res, next) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      console.log(email);
      console.log(password);
      userHelpers.doLogin(req.body).then((response) => {
        if (response.status) {
          req.session.loggedIn = response;
          req.session.user = response.user;
          console.log(req.session);
          res.redirect("/home");
        } else {
          req.session.loggedError = true;
          res.redirect("/login");
        }
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  signout: (req, res, next) => {
    try {
      req.session.loggedIn = null;
      req.session.user = null;
      res.redirect("/login");
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  productDetails: async (req, res, next) => {
    try {
      const proId = req.params.id;
      const oneProduct = await product.findById({ _id: proId });
      console.log(oneProduct);
      res.render("user/product_details", { oneProduct });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  addToCart: async (req, res, next) => {
    try {
      console.log(req.params.id);
      const id = req.params.id;
      console.log(req.session.user);
      const userId = req.session.user._id;
      const userz = await users.findOne({ _id: userId });
      await product.findById({ _id: id }).then((product) => {
        console.log(product);
        userz.addToCart(product).then((result) => {
          res.redirect("/cart");
        });
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  cart: async (req, res, next) => {
    try {
      const userId = req.session.user._id;

      const userz = await users.findOne({ _id: userId });
      console.log("newwwwwwww", userz);

      let user = await userz.populate("cart.items.productId");

      console.log("userrrrr", user);
      res.render("user/cart", { user });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  deleteCart: async (req, res, next) => {
    try {
      const proId = req.params.id;
      const userId = req.session.user._id;
      const userz = await users.findOne({ _id: userId });
      console.log(proId);
      userz.removeFromCart(proId).then(() => {
        res.redirect("/cart");
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  viewWishList: async (req, res, next) => {
    try {
      let users = req.session.user;
      let id = req.session.user._id.toString();
      // console.log(id);
      const prd = await wishlist
        .findOne({ userId: id })
        .populate("productItems");

      let count = null;
      if (users) {
        count = users.cart.items.length;
      }
      console.log(prd);
      console.log(users);
      res.render("user/wishlist", { users, prd, count });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  doAddToWishlist: async (req, res, next) => {
    try {
      const usser = req.session.user;
      console.log("hi");
      let id = req.session.user._id;
      const products = req.params.id;
      console.log("lllllllllllll", products);
      const wish = await wishlist.findOne({ userId: id });
      if (wish) {
        // console.log('und');
        wish.addToWishlist(products, async (response) => {
          console.log(response)
          const proDt = await wishlist
            .find({ userId: id }, { productItems: 1, _id: 0 })
            .populate("productItems");
          if (response.status) {
            console.log("entered ");
            res.json({ data: true });
          } else {
            res.json({ data: false });
          }
        });
      } else {
        const newWishlist = new wishlist({
          userId: id,
          productId: products,
        });
        newWishlist.save((err, doc) => {
          if (doc) {
            res.redirect("/wishlist");
          } else {
            res.redirect("/shop");
          }
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  deleteWishlist: async (req, res, next) => {
    try {
      const proId = req.params.id;
      let userId = req.session.user._id;
      console.log(proId, "hiii", userId);
      await wishlist.findOneAndUpdate(
        { userId: userId },
        { $pull: { productItems: proId } },
        { new: true }
      );
      res.redirect("/wishlist");
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  userProfile: async (req, res, next) => {
    try {
      let id = req.session.user._id;
      let user = req.session.user;

      const add = await address.findOne({ userId: id });
      console.log("user profile");

      res.render("user/profile", { user, add });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  changeQuantity: async (req, res, next) => {
    console.log("working...");

    try {
      const id = req.session.loggedIn.user._id;
      const useer = await users.findById(id);
      console.log(req.body);
      useer.changeQty(
        req.body.productId,
        req.body.quantys,
        req.body.count,
        (response) => {
          if (response.stock) {
            response.access = true;
            res.json(response);
          } else {
            response.access = true;

            res.json(response);
          }
        }
      );
    } catch (e) {
      console.log(e);
      next(e);
    }
  },

  addAddress: (req, res) => {
    res.render("user/add_address");
  },
  postAddAddress: async (req, res, next) => {
    try {
      let user = req.session.user._id;
      console.log(user);
      const add = await address.findOne({ userId: user });
      if (add) {
        await address.updateOne(
          { userId: user },
          { $push: { address: req.body } }
        );
        res.status(200);
        // .json({status:true})
      } else {
        req.body.status = true;
        const ad = new address({
          address: [req.body],
          userId: user,
        });
        ad.save((err, doc) => {
          if (err) {
            console.log(err);
            res.redirect("/profile");
          } else {
            console.log(doc);
            // res.json({status:true})
          }
        });
      }
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  deleteAddress: async (req, res, next) => {
    try {
      console.log(req.params);
      const addressId = req.params.id;
      let user = req.session.user._id;
      console.log(user);

      address
        .updateOne({ userId: user }, { $pull: { address: { _id: addressId } } })
        .then(() => console.log("Deleted"));
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  checkout: async (req, res, next) => {
    try {
      const uzerId = req.session.user._id;
      const userz = await users.findOne({ _id: uzerId });
      const add = await address.findOne({ userId: uzerId });
      let user = await userz.populate("cart.items.productId");
      res.render("user/checkout", { user, add });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  placeOrder: async (req, res, next) => {
    try {
      console.log("Place Order is running");
      console.log(req.body);
      const uzerId = req.session.user._id;
      const user = await users.findOne({ _id: uzerId });
      let product = await user.populate("cart.items.productId");
      var body = req.body.payment.toString();
      var addId = req.body.selector;
      console.log(addId);
      let productIds = product.cart.items;
      console.log(product.cart.items[0].productId, "koooi");
      let totalPrice = product.cart.totalPrice;
      console.log(totalPrice);
      console.log(productIds);
      if (body === "COD") {
        var statuz = "Placed";
        console.log(statuz);
        const newOrder = new order({
          userId: uzerId,
          date: new Date(),
          total: totalPrice + 50,
          payment: body,
          address: addId,
          status: statuz,
          products: user.cart.items,
        });
        newOrder.save();
        user.updateOne(
          { _id: uzerId },
          { $set: { cart: { items: [] }, totalPrice: 0 } }
        );
        res.json({ codSucces: true });
      } else {
        var statuz = "Pending";

        console.log(statuz);
        const newOrder = new order({
          userId: uzerId,
          date: new Date(),
          total: totalPrice + 50,
          payment: body,
          address: addId,
          status: statuz,
          products: productIds,
        });
        newOrder.save();
        user.updateOne(
          { _id: uzerId },
          { $set: { cart: { items: [] }, totalPrice: 0 } }
        );
        console.log(newOrder._id);
        const newOrderId = newOrder._id;
        userHelpers
          .generateRazorpay(newOrderId, totalPrice)
          .then((response) => {
            console.log(response);
            res.json(response);
          });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  orders: async (req, res, next) => {
    try {
      const uzerId = req.session.user._id;
      console.log(uzerId);
      const orde = await order.find({ userId: uzerId }).sort([["date", -1]]);
      res.render("user/orders", { orde });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  orderedPage: (req, res) => {
    res.render("user/orderPlaced");
  },
  cancelOrder: async (req, res, next) => {
    try {
      console.log(req.params);
      const orderId = req.params;
      //  orderId.toString()
      await order.updateOne(
        { _id: req.params.id },
        { $set: { status: "Canceled" } }
      );
      console.log("req.params");
      res.redirect("/orders");
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  changePassword: async (req, res, next) => {
    try {
      const uzerId = req.session.user._id;
      const oldPass = req.body.password;
      const newPass = await bcrypt.hash(req.body.newPassword, 10);
      const conPass = await bcrypt.hash(req.body.confirmPassword, 10);
      console.log(oldPass, "kooi", newPass, conPass);
      let user = await users.findById({ _id: uzerId });
      console.log(user);
      bcrypt.compare(oldPass, user.password).then((status) => {
        if (status) {
          console.log("Password matched");
          async () => {
            await users.findByIdAndUpdate(uzerId, {
              $set: { password: newPass, confirmPassword: conPass },
            });
          };
          console.log("very good");
          res.redirect("/profile");
        } else {
          console.log("Password not match");
        }
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  verifyPayment: (req, res, next) => {
    try {
      console.log("VerifyPayment running");
      const body = req.body;

      userHelpers
        .verifyPayment(body)
        .then(() => {
          console.log(body.order.receipt);
          console.log(req.body);
          var orderId = body.order.receipt;

          userHelpers.changePaymentStatus(orderId).then(() => {
            console.log("Payment successful");
            res.json({ status: true });
          });
        })
        .catch((err) => {
          console.log(err);
          res.json({ status: false });
        });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  paymentSuccess: (req, res) => {
    res.render("user/payment_success");
  },
  viewOrder: async (req, res, next) => {
    try {
      console.log("view order is running");
      const orderId = req.params.id;
      console.log(orderId);
      var orderDetials = await order
        .findOne({ _id: orderId })
        .populate("products.productId");
      console.log(orderDetials);
      res.render("user/view_order", { orderDetials });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  aboutPage: (req, res) => {
    res.render("user/about");
  },
  contact: (req, res) => {
    res.render("user/contact");
  },
  getAllProducts: async (req, res, next) => {
    try {
      const count = null;
      const page = parseInt(req.query.page) || 1;
      const limit = 9;

      let sort = req.query.sort || "description";
      req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);
      const sortBy = {};
      if (sort[1]) {
        sortBy[sort[0]] = sort[1];
      } else {
        sortBy[sort[0]] = "asc";
      }
      const query = {};
      if (req.query.categoryId) {
        query.category = req.query.categoryId;
      }
      if (req.query.search) {
        query.$or = [
          { name: { $regex: req.query.search, $options: "i" } },
          { description: { $regex: req.query.search, $options: "i" } },
        ];
      }
      const type = await category.find();
      const produc = await product
        .find(query)
        .populate("category")
        .sort(sortBy)
        .skip((page - 1) * limit)
        .limit(limit);
      const total = await product.countDocuments(query);
      res.render("user/shop", {
        login: true,
        user: req.session.user,
        produc,
        type,
        count,
        page,
        hasNextPage: limit * page < total,
        hasPreviousPage: page > 1,
        PreviousPage: page - 1,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
