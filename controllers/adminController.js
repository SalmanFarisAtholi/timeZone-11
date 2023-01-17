const products = require("../models/product");
const users = require("../models/userdb");
const category = require("../models/category");
const adminHelpers = require("../helpers/adminHelpers");
const order = require("../models/order");

var adminEmail = process.env.adminEmail;
var adminPassword = process.env.adminPassword;
module.exports = {
  login: (req, res) => {
    req.session.admin = false;
    req.session.destroy();
    res.render("admin/login");
  },
  loginPost: (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    // console.log(email,password);
    // console.log(adminEmail,adminPassword);
    if (email === adminEmail && password === adminPassword) {
      req.session.admin = true;
      res.render("admin/dashboard");
    }
  },
  signout: (req, res) => {
    req.session.destroy();
    admin = false;
    console.log("h");
    res.redirect("/admin/login");
  },
  userManage: async (req, res) => {
    const userlist = await users.find();
    console.log(userlist);

    res.render("admin/user_management", { admin: true, userlist });
  },
  categoryManage: async (req, res) => {
    const categoryList = await category.find({
      access: { $not: { $eq: false } },
    });

    res.render("admin/category_management", { admin: true, categoryList });
  },
  productManage: async (req, res) => {
    const product = await products.find({ access: { $not: { $eq: false } } });

    res.render("admin/product_management", { product });
  },
  dashboard: (req, res) => {
    res.render("admin/dashboard");
  },
  blockUser: async (req, res) => {
    console.log("looooo");
    const userId = req.params.id;
    await users.findByIdAndUpdate(userId, { access: false });
    res.redirect("/admin/users");
  },
  unblockUser: async (req, res) => {
    const userId = req.params.id;
    await users.findByIdAndUpdate(userId, { access: true });
    res.redirect("/admin/users");
  },
  addCategory: (req, res) => {
    res.render("admin/add_category");
  },
  addProduct: async (req, res) => {
    const categoryList = await category.find();

    res.render("admin/add_product", { categoryList });
  },
  createCategory: (req, res) => {
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
    newCategory
      .save()
      .then((newOne) => {
        console.log(newOne);
        res.redirect("/admin/categorys");
      })
      .catch((err) => {
        console.log(err);
      });
  },
  deleteCategory: (req, res) => {
    const id = req.params.id;
    adminHelpers.deleteCategory(id).then(() => {
      res.redirect("/admin/categorys");
    });
  },
  createProduct: (req, res) => {
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
    newProduct
      .save()
      .then((newOne) => {
        console.log(newOne);
        res.redirect("/admin/products");
      })
      .catch((err) => {
        console.log(err);
      });
  },
  deleteProduct: (req, res) => {
    const id = req.params.id;
    adminHelpers.deleteProduct(id).then(() => {
      res.redirect("/admin/products");
    });
  },
  editCategory: async (req, res) => {
    const id = req.params.id;

    const oneCategory = await category.findOne({ _id: id });
    res.render("admin/edit_category", { oneCategory });
    console.log(oneCategory);
  },
  postEditCategory: async (req, res) => {
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
  },
  editProduct: async (req, res) => {
    const id = req.params.id;
    const categoryList = await category.find();
    const oneProduct = await products.findOne({ _id: id });
    res.render("admin/edit_product", { oneProduct, categoryList });
    console.log(oneProduct);
  },
  postEditProduct: async (req, res) => {
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
  },
  bannerManage: (req, res) => {
    res.render("admin/banner_management");
  },
  orderManage: async (req, res) => {
    const ord = await order.find();
    res.render("admin/order_management", { ord });
  },
};
