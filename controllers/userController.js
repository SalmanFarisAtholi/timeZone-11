const bcrypt = require("bcrypt");
const { response } = require("express");
const userHelpers = require("../helpers/userHelpers");
const users = require("../models/userdb");

// const {sendotp,verifyotp} = require("../uttilities/otp");

module.exports = {
  signup: (req, res) => {
    res.render("user/signup");
  },
  index: (req, res) => {
    res.render("index");
  },
  login: (req, res) => {
    res.render("user/login");
  },
  home: (req, res) => {
    res.render("user/home");
  },
  shop: (req, res) => {
    res.render("user/shop");
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
 
};
