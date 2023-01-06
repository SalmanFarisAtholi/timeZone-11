const express = require('express')
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
     postEditProduct
} = require('../controllers/adminController')
router.get('/',login)
router.post('/',loginPost)
router.get('/signout',signout)
router.get('/users',userManage)
router.get('/categorys',categoryManage)
router.get('/products',productManage)
router.get('/dashboard',dashboard)
router.get('/addCategory',addCategory)
router.get('/addProduct',addProduct)
router.get('/editCategory/:id',editCategory)
router.post('/editCategory/:id',postEditCategory)
router.get('/editProduct/:id',editProduct)
router.post('/editProduct/:id',postEditProduct)
router.get('/deleteCategory/:id',deleteCategory)
router.get('/deleteProduct/:id',deleteProduct)
router.get('/blockUser/:id',blockUser)
router.get('/unblockUser/:id',unblockUser)
router.post('/addCategory',createCategory)
router.post('/addProduct',createProduct)









module.exports = router