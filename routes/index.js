const express = require('express')
const { loginPost } = require('../controllers/adminController')
const router = express.Router()
const {
    login,
    signup,
    home,
    shop,
    sign,
    postLogin,
    index,
    signout,
    // otp,
    // postOtp
    productDetails,
    addToCart,
    cart,
    deleteCart,
    viewWishList,
    doAddToWishlist,
    deleteWishlist
} = require ('../controllers/userController')
const product = require('../models/product')


router.get('/',index)
router.get('/login',login)
router.get('/signup',signup)
router.get('/home',home)
router.get('/shop',shop)
router.get('/signout',signout)
router.get('/cart',cart)
// router.get('/otp',otp)
router.get('/productDetails',productDetails)
router.get('/addtoCart/:id',addToCart)
router.post('/signup',sign)
// router.post('/otp',postOtp)
router.post('/login',postLogin)
router.get('/deleteCart/:id',deleteCart)
router.get('/wishlist',viewWishList)
router.get('/addToWishlist/:id',doAddToWishlist)
router.get('/deleteWishlist/:id',deleteWishlist)

module.exports = router