const products = require("../models/product");
const users = require("../models/userdb");
const category = require("../models/category");
const { response } = require("express");
const order = require("../models/order");

const coupen = require("../models/coupon");

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
  deleteCoupen: (id) =>
    new Promise((resolve, reject) => {
      const coupenId = id;
      coupen.findByIdAndUpdate(coupenId, { status: false }).then((response) => {
        resolve(response);
      });
    }),
  updateStatus: (req, res) => {
    console.log(" order id : ", req.body.orderId);
    let newStatus = req.body.newStatus;
    console.log(" new status: ", newStatus);
    let orderId = req.body.orderId;
    order.findOneAndUpdate(
      { _id: orderId },
      { $set: { status: newStatus } },
      { new: true },
      (err, doc) => {
        if (err) {
          console.log(" new order status updation failed ! ", err);
        } else {
          console.log(" new order updation successful .. ");
          console.log(doc);
          res.json({ current_status: doc.orderStatus, status: true });
        }
      }
    );
  },
  toSalesReport: async (req, res) => {
    try {
      let orders = await order.find();
      let salesData = await order.aggregate([
        {
          $match: {
            status: { $eq: "Delivered" },
            $and: [
              { createdAt: { $gt: new Date(req.body.from) } },
              { createdAt: { $lt: new Date(req.body.to) } },
            ],
          },
        },
        {
          $lookup: {
            from: "user",
            localField: "userId",
            foreignField: "_id",
            as: "userData",
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ]);
      console.log(salesData);
      res.render("admin/sales_report", {
        salesData,
        page: "sales_report",
      });
    } catch (error) {
      console.log(error);
      error.admin = true;
      next(error);
    }
  },
  dashboard: async (req, res) => {
   const orde=await order.find()
   var Delivered=0
 
    for (let i = 0; i < orde.length; i++) {
      if (orde.status==='Delivered'){
     Delivered=+1
    }
    
   }
   console.log(Delivered);
   res.render("admin/dashboard")
  }
  
  
 
};
