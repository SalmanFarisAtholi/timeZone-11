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

} = require ('../controllers/userController')


router.get('/',index)
router.get('/login',login)
router.get('/signup',signup)
router.get('/home',home)
router.get('/shop',shop)
router.get('/signout',signout)
// router.get('/otp',otp)


router.post('/signup',sign)
// router.post('/otp',postOtp)
router.post('/login',postLogin)

module.exports = router