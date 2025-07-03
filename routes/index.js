const express = require('express')
const router = express.Router()
const userRouter = require('./user')
const productRouter = require('./product')
const Controller = require('../controllers/controller')

// Register
router.get('/register', Controller.registerForm)
router.post('/register', Controller.postRegister)

// Login
router.get('/login', Controller.loginForm)
router.post('/login', Controller.postLogin)

//Logout


router.use('/user', userRouter)
router.use('/product', productRouter)

const isLogin = function (req, res, next) {
    if (!req.session.userId) {
        const error = 'Please login first!'
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }

}

const isAdmin = function (req, res, next) {
    if (req.session.userId && req.session.role !== "Admin") {
        const error = 'You have no access!'
        res.redirect(`/home?error=${error}`)
    } else {
        next()
    }

}

router.get('/logout', isLogin, Controller.getLogout)





module.exports = router

