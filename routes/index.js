const express = require('express')
const { loginPost } = require('../controllers/adminController')
const {verifyUser} = require("../middleware/middleware")
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
    deleteWishlist,
    userProfile,
    changeQuantity,
    addAddress,
    postAddAddress,
    deleteAddress,
    checkout,
    placeOrder,
    orders,
    orderedPage,
    cancelOrder,
    changePassword,
    verifyPayment,
    paymentSuccess,
    viewOrder,
    aboutPage,
    contact
} = require ('../controllers/userController')
const product = require('../models/product')


router.get('/',index)
router.get('/login',login)
router.get('/signup',signup)  
router.get('/home',home)
router.get('/shop',shop)
router.get('/signout',verifyUser,signout)
router.get('/cart',verifyUser,cart)
// router.get('/otp',verifyUser,otp)
router.get('/productDetails/:id',verifyUser,productDetails)
router.get('/addtoCart/:id',verifyUser,addToCart)
router.post('/signup',sign)
// router.post('/otp',verifyUser,postOtp)
router.post('/login',postLogin)
router.get('/deleteCart/:id',verifyUser,deleteCart)
router.get('/wishlist',verifyUser,viewWishList)
router.get('/addToWishlist/:id',verifyUser,doAddToWishlist)
router.get('/deleteWishlist/:id',verifyUser,deleteWishlist)
router.get('/profile',verifyUser,userProfile)
router.post('/changeQty',verifyUser,changeQuantity)
router.get('/addAddress',verifyUser,addAddress)
router.post('/postAddress',verifyUser,postAddAddress)
router.get('/deleteAddress/:id',verifyUser,deleteAddress)
router.get('/checkout',verifyUser,checkout)
router.post('/placeOrder',verifyUser,placeOrder)
router.post('/veifyPayment',verifyPayment)
router.get('/orders',verifyUser,orders)
router.get('/orderPlaced',verifyUser,orderedPage)
router.get('/paymentSuccess',verifyUser,paymentSuccess)
router.get('/cancelOrder/:id',verifyUser,cancelOrder)
router.post('/changePassword',verifyUser,changePassword)
router.get('/viewOrder/:id',verifyUser,viewOrder)
router.get('/about',verifyUser,aboutPage)
router.get('/contact',verifyUser,contact)

module.exports = router