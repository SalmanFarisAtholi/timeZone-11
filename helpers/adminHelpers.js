const products = require("../models/product");
const users = require("../models/userdb");
const category = require("../models/category");
const { response } = require("express");

module.exports = {
  deleteCategory: (id) =>
    new Promise((resolve, reject) => {
      const categoryId = id;
      category
        .findByIdAndUpdate(categoryId, { access: false })
        .then((response) => {
          resolve(response);
        });
    }),
  deleteProduct: (id) =>
    new Promise((resolve, reject) => {
      const productId = id;
      products
        .findByIdAndUpdate(productId, { access: false })
        .then((response) => {
          resolve(response);
        });
    }),
  // editCategory:(id)=>
  //   new Promise((resolve,reject)=>{
  //     category.findOne({_id:id}).then((response)=>{
  //       resolve(response);
  //     });    await users.findByIdAndUpdate(userId, { access: false });

  //   }),
};
