const express = require('express')
const {verifyAdmin} =require('../middleware/middleware')
const router = express.Router()
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
     bannerManage,
     orderManage
} = require('../controllers/adminController')
router.get('/',login)
router.post('/',loginPost)
router.get('/signout',signout)
router.get('/users',verifyAdmin,userManage)
router.get('/categorys',verifyAdmin,categoryManage)
router.get('/products',verifyAdmin,productManage)
router.get('/dashboard',verifyAdmin,dashboard)
router.get('/addCategory',verifyAdmin,addCategory)
router.get('/addProduct',verifyAdmin,addProduct)
router.get('/editCategory/:id',verifyAdmin,editCategory) 
router.post('/editCategory/:id',verifyAdmin,postEditCategory)
router.get('/editProduct/:id',verifyAdmin,editProduct)
router.post('/editProduct/:id',verifyAdmin,postEditProduct)
router.get('/deleteCategory/:id',verifyAdmin,deleteCategory)
router.get('/deleteProduct/:id',verifyAdmin,deleteProduct)
router.get('/blockUser/:id',verifyAdmin,blockUser)
router.get('/unblockUser/:id',verifyAdmin,unblockUser)
router.post('/addCategory',verifyAdmin,createCategory)
router.post('/addProduct',verifyAdmin,createProduct)
router.get('/banners',verifyAdmin,bannerManage) 
router.get('/orders',verifyAdmin,orderManage)










module.exports = router