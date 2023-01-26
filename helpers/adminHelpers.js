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
        user: false,
        admin: true,
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
    try {
      const orders = await orders.find({});
      let today = new Date();
      let todayStarting = new Date(today.setUTCHours(0, 0, 0, 0));
      let todayEnding = new Date(today.setUTCHours(23, 59, 59, 999));

      // finding today sales count:
      let todaySales = await orders.countDocuments({
        date: { $gt: todayStarting, $lt: todayEnding },
        status: { $eq: "Delivered" },
      });
      // finding total
      let totalSales = await orders.countDocuments({
        status: { $eq: "Delivered" },
      });

      // today revenue:
      let todayRev = await orders.aggregate([
        {
          $match: {
            $and: [
              { date: { $gt: todayStarting, $lt: todayEnding } },
              { status: { $eq: "Delivered" } },
            ],
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            todayRevenue: { $sum: "$total" },
          },
        },
      ]);
      let todayRevenue = 0;
      if (todayRev[0] == undefined || todayRev.length <= 0) {
        todayRevenue = 0;
      } else {
        todayRevenue = todayRev[0].todayRevenue;
      }

      // total revenue:
      let totalRev = await orders.aggregate([
        {
          $match: {
            status: { $eq: "Delivered" },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$total" },
          },
        },
      ]);
      let totalRevenue = totalRev[0].totalRevenue;
      // start of month:
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      // end of month:
      const endOfMonth = new Date();
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setHours(23, 59, 59, 999);

      // start of year:
      const startOfYear = new Date();
      startOfYear.setMonth(0);
      startOfYear.setDate(1);
      console.log("start of year: ", startOfYear);

      // end of year:
      const endOfYear = new Date();
      endOfYear.setDate(31);
      endOfYear.setMonth(11);
      endOfYear.setHours(23, 59, 59, 999);
      console.log("end of year: ", endOfYear);

      let salesData = await orders.aggregate([
        {
          $match: {
            date: {
              $gte: startOfMonth,
              $lt: endOfMonth,
            },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      let yearlySales = await orders.aggregate([
        {
          $match: {
            $and: [
              { status: "Delivered" },
              {
                date: {
                  $gte: startOfYear,
                  $lt: endOfYear,
                },
              },
            ],
          },
        },
        {
          $group: {
            _id: { year: { $year: "$date" }, month: { $month: "$date" } },
            totalSales: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.month": 1 },
        },
      ]);
      console.log();
      res.render("admin/dashboard", {
        user: false,
        admin: true,
        page: "dashboard",
        todaySales,
        todayRevenue,
        totalRevenue,
        totalSales,
        salesData,
        yearlySales,
      });
    } catch (error) {
      console.log("Dashboard error",error);
    }
  },
};
