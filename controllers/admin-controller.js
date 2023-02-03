const products = require("../models/product");
const users = require("../models/userdb");
const category = require("../models/category");
const adminHelpers = require("../helpers/admin-helpers");
const order = require("../models/order");
const coupon = require("../models/coupon");
const banner = require("../models/banner");

var adminEmail = process.env.adminEmail;
var adminPassword = process.env.adminPassword;
module.exports = {
  login: (req, res, next) => {
    try {
      req.session.admin = false;
      res.render("admin/login");
    } catch (error) {
      error.admin = true;
      next(error);
    }
  },
  loginPost: (req, res, next) => {
    try {
      console.log(req.body);
      const email = req.body.email;
      const password = req.body.password;
      // console.log(email,password);
      // console.log(adminEmail,adminPassword);
      if (email === adminEmail && password === adminPassword) {
        req.session.admin = true;
        res.render("admin/dashboard");
      }
    } catch (error) {
      error.admin = true;
      console.log("errr", error);
    }
  },
  signout: (req, res) => {
    req.session.admin = null;
    admin = false;
    console.log("h");
    res.redirect("/admin/");
  },
  userManage: async (req, res, next) => {
    try {
      const userlist = await users.find();
      console.log(userlist);

      res.render("admin/user_management", { admin: true, userlist });
    } catch (e) {
      e.admin = true;
      next(e);
    }
  },
  categoryManage: async (req, res, next) => {
    try {
      const categoryList = await category.find({
        access: { $not: { $eq: false } },
      });

      res.render("admin/category_management", { admin: true, categoryList });
    } catch (error) {
      error.admin = true;
      next(error);
    }
  },
  productManage: async (req, res, next) => {
    try {
      const product = await products.find({ access: { $not: { $eq: false } } });

      res.render("admin/product_management", { product });
    } catch (error) {
      error.admin = true;
      next(error);
    }
  },
  dashboard: (req, res) => {
    adminHelpers.dashboard(req.body);
  },
  blockUser: async (req, res, next) => {
    try {
      console.log("looooo");
      const userId = req.params.id;
      await users.findByIdAndUpdate(userId, { access: false });
      res.redirect("/admin/users");
    } catch (error) {
      error.admin = true;
      next(error);
    }
  },
  unblockUser: async (req, res, next) => {
    try {
      const userId = req.params.id;
      await users.findByIdAndUpdate(userId, { access: true });
      res.redirect("/admin/users");
    } catch (error) {
      error.admin = true;
      next(error);
    }
  },
  addCategory: (req, res, next) => {
    res.render("admin/add_category");
  },
  addProduct: async (req, res) => {
    try {
      const categoryList = await category.find();

      res.render("admin/add_product", { categoryList });
    } catch (error) {
      error.admin = true;
      next(error);
    }
  },
  createCategory: (req, res, next) => {
    try {
      console.log("category is here");
      const image = req.files.img;
      console.log(image);
      console.log(req.body);
      if (!image) {
        res.redirect("/admin/addCategory", {
          user: false,
          admin: true,
          error: "file is not a image",
        });
      }
      let imageUrl = image[0].path;
      imageUrl = imageUrl.substring(6);
      console.log(`hi ${imageUrl}`);
      const newCategory = new category({
        name: req.body.name,
        description: req.body.description,
        img: imageUrl,
      });
      newCategory.save().then((newOne) => {
        console.log(newOne);
        res.redirect("/admin/categorys");
      });
    } catch (error) {
      error.admin = true;
      next(error);
    }
  },
  deleteCategory: (req, res, next) => {
    try {
      const id = req.params.id;
      adminHelpers.deleteCategory(id).then(() => {
        res.redirect("/admin/categorys");
      });
    } catch (error) {
      error.admin = true;
      next(error);
    }
  },
  createProduct: (req, res, next) => {
    try {
      console.log("product is here");
      const image = req.files.img;
      console.log(image);
      console.log(req.body);
      if (!image) {
        res.render("admin/addProduct", {
          user: false,
          admin: true,
          error: "file is not a image",
        });
      }
      let imageUrl = image[0].path;
      imageUrl = imageUrl.substring(6);
      console.log(`hi ${imageUrl}`);
      const newProduct = new products({
        name: req.body.name,
        description: req.body.description,
        img: imageUrl,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock,
        mfg: req.body.mfg,
      });
      newProduct.save().then((newOne) => {
        console.log(newOne);
        res.redirect("/admin/products");
      });
    } catch (error) {
      error.admin = true;
      next(error);
    }
  },
  deleteProduct: (req, res, next) => {
    try {
      const id = req.params.id;
      adminHelpers.deleteProduct(id).then(() => {
        res.redirect("/admin/products");
      });
    } catch (error) {
      error.admin = true;
      next(error);
    }
  },
  editCategory: async (req, res, next) => {
    try {
      const id = req.params.id;

      const oneCategory = await category.findOne({ _id: id });
      res.render("admin/edit_category", { oneCategory });
      console.log(oneCategory);
    } catch (error) {
      error.admin = true;
      next(error);
    }
  },
  postEditCategory: async (req, res, next) => {
    try {
      const id = req.params.id;
      const updatedName = req.body.name;
      const updatedDescription = req.body.description;
      const image = req.files.img;
      const cat = { name: updatedName, description: updatedDescription };
      if (image) {
        const imageUrl = image[0].path.substring(6);
        console.log(`hi ${imageUrl}`);
        cat.image = imageUrl;
      }
      console.log(cat.image);

      await category.updateOne(
        { _id: id },
        {
          $set: {
            name: cat.name,
            description: cat.description,
            img: cat.image,
          },
        }
      );
      res.redirect("/admin/categorys");
    } catch (error) {
      error.admin = true;
      next(error);
    }
  },
  editProduct: async (req, res, next) => {
    try {
      const id = req.params.id;
      const categoryList = await category.find();
      const oneProduct = await products.findOne({ _id: id });
      res.render("admin/edit_product", { oneProduct, categoryList });
      console.log(oneProduct);
    } catch (error) {
      error.admin = true;
      next(error);
    }
  },
  postEditProduct: async (req, res, next) => {
    try {
      const id = req.params.id;
      console.log(id, 00000000000000000);
      const updatedName = req.body.name;
      const updatedDescription = req.body.description;
      const image = req.files.img;
      const updatedStock = req.body.stock;
      const updatedPrice = req.body.price;
      const updatedMfg = req.body.mfg;
      const updatedCategory = req.body.category;
      const pro = {
        name: updatedName,
        description: updatedDescription,
        stock: updatedStock,
        price: updatedPrice,
        mfg: updatedMfg,
        category: updatedCategory,
      };
      if (image) {
        const imageUrl = image[0].path.substring(6);
        console.log(`hi ${imageUrl}`);
        pro.image = imageUrl;
      }
      console.log(pro.image);

      await products.updateOne(
        { _id: id },
        {
          $set: {
            name: pro.name,
            description: pro.description,
            img: pro.image,
            stock: pro.stock,
            mfg: pro.mfg,
            category: pro.category,
            price: pro.price,
          },
        }
      );
      res.redirect("/admin/products");
    } catch (error) {
      error.admin = true;
      next(error);
    }
  },
  orderManage: async (req, res, next) => {
    try {
      const ord = await order.find().sort([["date", -1]]);
      res.render("admin/order_management", { ord });
    } catch (error) {
      error.admin = true;
      next(error);
    }
  },
  coupenManage: async (req, res, next) => {
    try {
      const coupens = await coupon.find({ status: { $not: { $eq: false } } });
      res.render("admin/coupen_management", { coupens });
    } catch (error) {
      error.admin = true;
      next(error);
    }
  },
  addCoupen: (req, res) => {
    try {
      console.log(req.body);
      const newCoupen = new coupon({
        name: req.body.name,
        discount: req.body.discount,
        minCartAmount: req.body.minCartAmount,
        startDate: req.body.startDate,
        exDate: req.body.exDate,
      });
      newCoupen.save().then((newOne) => {
        console.log(newOne);
        res.redirect("/admin/coupens");
      });
    } catch (error) {
      error.admin = true;
      next(error);
    }
  },
  deleteCoupen: (req, res, next) => {
    try {
      const id = req.params.id;
      console.log(id);
      adminHelpers.deleteCoupen(id).then(() => {
        console.log("ooooooooooooooooo");

        res.redirect("/admin/coupens");
      });
    } catch (error) {
      error.admin = true;
      next(error);
    }
  },
  editCoupen: async (req, res, next) => {
    try {
      const id = req.params.id;

      const oneCoupen = await coupon.findOne({ _id: id });
      res.render("admin/edit_coupen", { oneCoupen });
    } catch (error) {
      error.admin = true;
      next(error);
    }
  },
  postEditCoupen: async (req, res, next) => {
    try {
      console.log(req.body);
      const id = req.params.id;
      await coupon.updateOne(
        { _id: id },
        {
          $set: {
            name: req.body.name,
            discount: req.body.discount,
            minCartAmount: req.body.minCartAmount,
            startDate: req.body.startDate,
            exDate: req.body.exDate,
          },
        }
      );
      res.redirect("/admin/coupens");
    } catch (error) {
      error.admin = true;
      next(error);
    }
  },
  updateStatus: (req, res) => {
    adminHelpers.updateStatus(req, res);
  },
  salesReport: (req, res) => {
    res.render("admin/sales_report_date");
  },
  toSalesReport: (req, res) => {
    adminHelpers.toSalesReport(req, res);
  },
  orderDetailes: async (req, res, next) => {
    try {
      const orderId = req.params.id;
      const orderDetials = await order
        .findOne({ _id: orderId })
        .populate("products.item");
      console.log("Goodd boy", orderDetials.products[0].item);
      // console.log(orderDetials.products[0]);
      res.render("admin/order_detailes", orderDetials);
    } catch (error) {
      error.admin = true;
      next(error);
    }
  },
  banners: (req, res) => {
    res.render("admin/banners");
  },
  addBanner: (req, res) => {
    try {
      console.log(req.body);
      const image = req.body.img;
      console.log(image);
      if (!image) {
        res.redirect("/admin/banners", {
          user: false,
          admin: true,
          error: "file is not a image",
        });
      }
      let imageUrl = image[0].path;
      imageUrl = imageUrl.substring(6);
      console.log(`hi ${imageUrl}`);
      const newBanner = new banner({
        description: req.body.description,
        img: imageUrl,
      });
      newBanner.save().then((newOne) => {
        console.log(newOne);
        res.redirect("/admin/banners");
      });
    } catch (error) {
      error.admin = true;
      console.log(error);
    }
  },
};
