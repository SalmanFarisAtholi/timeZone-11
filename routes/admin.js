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
     editCategory
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
// router.get('/editProduct')
router.get('/deleteCategory/:id',deleteCategory)
router.get('/deleteProduct/:id',deleteProduct)
router.get('/blockUser/:id',blockUser)
router.get('/unblockUser/:id',unblockUser)
router.post('/addCategory',createCategory)
router.post('/addProduct',createProduct)









module.exports = router