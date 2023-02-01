const express = require("express");
const { verifyAdmin } = require("../middleware/middleware");
const router = express.Router();
const {
  login,
  loginPost,
  signout,
  userManage,
  categoryManage,
  productManage,
  dashboard,
  blockUser,
  unblockUser,
  addCategory,
  addProduct,
  createCategory,
  deleteCategory,
  createProduct,
  deleteProduct,
  editCategory,
  postEditCategory,
  editProduct,
  postEditProduct,
  orderManage,
  coupenManage,
  addCoupen,
  deleteCoupen,
  editCoupen,
  postEditCoupen,
  updateStatus,
  salesReport,
  toSalesReport,
  orderDetailes,
} = require("../controllers/admin-controller");
router.get("/", login);
router.post("/", loginPost);
router.get("/signout", verifyAdmin, signout);
router.get("/users", verifyAdmin, userManage);
router.get("/categorys", verifyAdmin, categoryManage);
router.get("/products", verifyAdmin, productManage);
router.get("/dashboard", verifyAdmin, dashboard);
router.get("/addCategory", verifyAdmin, addCategory);
router.get("/addProduct", verifyAdmin, addProduct);
router.get("/editCategory/:id", verifyAdmin, editCategory);
router.post("/editCategory/:id", verifyAdmin, postEditCategory);
router.get("/editProduct/:id", verifyAdmin, editProduct);
router.post("/editProduct/:id", verifyAdmin, postEditProduct);
router.get("/deleteCategory/:id", verifyAdmin, deleteCategory);
router.get("/deleteProduct/:id", verifyAdmin, deleteProduct);
router.get("/blockUser/:id", verifyAdmin, blockUser);
router.get("/unblockUser/:id", verifyAdmin, unblockUser);
router.post("/addCategory", verifyAdmin, createCategory);
router.post("/addProduct", verifyAdmin, createProduct);
router.get("/orders", verifyAdmin, orderManage);
router.get("/coupens", verifyAdmin, coupenManage);
router.post("/addCoupen", verifyAdmin, addCoupen);
router.get("/deleteCoupen/:id", verifyAdmin, deleteCoupen);
router.get("/editCoupen/:id", verifyAdmin, editCoupen);
router.post("/editCoupen/:id", verifyAdmin, postEditCoupen);
router.post("/updateStatus", verifyAdmin, updateStatus);
router.get("/salesReport", verifyAdmin, salesReport);
router.post("/dates", verifyAdmin, toSalesReport);
router.get("/orderDetailes/:id", verifyAdmin, orderDetailes);

module.exports = router;
