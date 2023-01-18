const bcrypt = require("bcrypt");
const { response } = require("express");
const userHelpers = require("../helpers/userHelpers");
const users = require("../models/userdb");
const product = require("../models/product");
const wishlist = require("../models/wishlist");
const address = require("../models/address");
const { data } = require("jquery");
const order = require("../models/order");
// const {sendotp,verifyotp} = require("../uttilities/otp");

module.exports = {
  signup: (req, res, next) => {
    try {
      res.render("user/signup");
    } catch (e) {
      next(new Error(e));
    }
  },
  index: (req, res) => {
    res.render("index");
  },
  login: (req, res) => {
    res.render("user/login");
  },
  home: async (req, res) => {
    const products = await product.find({ access: true });
    res.render("user/home", { products });
  },
  shop: async (req, res) => {
    const products = await product.find({ access: true });
    res.render("user/shop", { products });
  },
  sign: async (req, res) => {
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
    //  sendotp(req.body.mobile)
    user.save((error, doc) => {
      if (error) {
        console.log(error);
      } else {
        console.log(doc);
      }
    });
    res.redirect("/login");
  },
  postLogin: (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email);
    console.log(password);
    userHelpers.doLogin(req.body).then((response) => {
      if (response.status) {
        req.session.loggedIn = response;
        req.session.user = response.user;
        res.render("user/home");
      } else {
        req.session.loggedError = true;
        res.redirect("/login");
      }
    });
  },
  signout: (req, res) => {
    req.session.user = null;
    // user=false
    res.redirect("/login");
    console.log("hhhhhhhhhhhhhhhiiiiiiiiiiiiiii");
  },
  productDetails: (req, res) => {
    console.log("brooo");
    res.render("user/product_details");
  },
  addToCart: async (req, res) => {
    console.log(req.params.id);
    const id = req.params.id;
    console.log(req.session.user);
    const userId = req.session.user._id;
    const userz = await users.findOne({ _id: userId });
    await product
      .findById({ _id: id })
      .then((product) => {
        console.log(product);
        userz.addToCart(product).then((result) => {
          res.redirect("/cart");
        });
      })
      .catch((err) => console.log(err));
  },
  cart: async (req, res) => {
    const userId = req.session.user._id;

    const userz = await users.findOne({ _id: userId });
    console.log("newwwwwwww", userz);

    let user = await userz.populate("cart.items.productId");

    console.log("userrrrr", user);
    res.render("user/cart", { user });
  },
  deleteCart: async (req, res) => {
    const proId = req.params.id;
    const userId = req.session.user._id;
    const userz = await users.findOne({ _id: userId });
    console.log(proId);
    userz
      .removeFromCart(proId)
      .then(() => {
        res.redirect("/cart");
      })
      .catch((err) => console.log(err));
  },
  viewWishList: async (req, res) => {
    let users = req.session.user;
    let id = req.session.user._id.toString();
    // console.log(id);
    const prd = await wishlist.findOne({ userId: id }).populate("productItems");

    let count = null;
    if (users) {
      count = users.cart.items.length;
    }
    console.log(prd);
    console.log(users);
    res.render("user/wishlist", { users, prd, count });
  },
  doAddToWishlist: async (req, res) => {
    const usser = req.session.user;
    console.log("hi");
    let id = req.session.user._id;
    const products = req.params.id;
    console.log("lllllllllllll", products);
    const wish = await wishlist.findOne({ userId: id });
    if (wish) {
      // console.log('und');
      wish.addToWishlist(products, async (response) => {
        const proDt = await wishlist
          .find({ userId: id }, { productItems: 1, _id: 0 })
          .populate("productItems");
        if (response.status) {
          console.log("entered ");
          res.redirect("/wishlist");
        } else {
          res.redirect("/shop");
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
  },

  deleteWishlist: async (req, res) => {
    const proId = req.params.id;
    let userId = req.session.user._id;
    console.log(proId, "hiii", userId);
    await wishlist.findOneAndUpdate(
      { userId: userId },
      { $pull: { productItems: proId } },
      { new: true }
    );
    res.redirect("/wishlist");
  },
  userProfile: async (req, res) => {
    let id = req.session.user._id;
    let user = req.session.user;

    const add = await address.findOne({ userId: id });
    console.log("user profile");

    res.render("user/profile", { user, add });
  },
  changeQuantity: async (req, res) => {
    console.log("good boy");
    let user = req.session.user;
    const userz = await users.findOne(user);
    userz.changeQty(
      req.body.productId,
      req.body.qty,
      req.body.count,
      (response) => {
        response.access = true;
        console.log(response);
        res.json(response);
      }
    );
  },
  addAddress: (req, res) => {
    res.render("user/add_address");
  },
  postAddAddress: async (req, res) => {
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
  },
  deleteAddress: async (req, res) => {
    console.log(req.params);
    const addressId = req.params.id;
    let user = req.session.user._id;
    console.log(user);

    address
      .updateOne({ userId: user }, { $pull: { address: { _id: addressId } } })
      .then(() => console.log("Deleted"))
      .catch((er) => console.log(er));
    res.redirect("/profile");
  },

  checkout: async (req, res) => {
    const uzerId = req.session.user._id;
    const userz = await users.findOne({ _id: uzerId });
    const add = await address.findOne({ userId: uzerId });
    let user = await userz.populate("cart.items.productId");
    res.render("user/checkout", { user, add });
  },
  placeOrder: async (req, res) => {
    console.log("Place Order is running");
    console.log(req.body);
    const uzerId = req.session.user._id;
    const userz = await users.findOne({ _id: uzerId });
    let product = await userz.populate("cart.items.productId");
    var body = req.body.payment.toString();
    var addId = req.body.selector;
    console.log(addId);
    let productIds = product.cart.items;
    console.log(product.cart.items[0].productId, "koooi");
    let totalPrice = product.cart.totalPrice;
    console.log(totalPrice);
    if (body === "COD") {
      var statuz = "Placed";
      res.json((response.status = true));
    } else {
      var statuz = "Pending";
    }
    console.log(statuz);
    const newOrder = new order({
      userId: uzerId,
      date: new Date(),
      total: totalPrice,
      payment: body,
      address: addId,
      status: statuz,
    });
    newOrder.save();
    console.log(newOrder);

    // const proId = req.params.id;
    // const userId = req.session.user._id;
    // const userz = await users.findOne({ _id: userId });
    // console.log(proId);
    // userz
    //   .removeFromCart(proId)
    //   .then(() => {
    //     res.redirect("/cart");
    //   })
    //   .catch((err) => console.log(err));
  },
  orders: async (req, res) => {
    console.log("order..order!!!");
    const uzerId = req.session.user._id;
    console.log(uzerId);
    const orde = await order.find({ userId: uzerId });
    res.render("user/orders", { orde });
  },
  orderedPage: (req, res) => {
    res.render("user/orderPlaced");
  },
  cancelOrder: async (req, res) => {
    console.log(req.params);
    const orderId = req.params;
    //  orderId.toString()
    await order.updateOne(
      { _id: req.params.id },
      { $set: { status: "Canceled" } }
    );
    console.log("req.params");
    res.redirect("/orders");
  },
  changePassword: async (req, res) => {
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
       async()=>{
       await users.findByIdAndUpdate(uzerId,{$set:{password:newPass},$set:{confirmPassword:conPass}})
      }
       console.log("very good");
       res.redirect("/profile")
      } else {
        console.log("Password not match");
      }
    });
  },
};
