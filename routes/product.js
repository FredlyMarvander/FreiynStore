const express = require('express')
const Controller = require('../controllers/controller')
const router = express.Router()

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
        res.redirect(`/?error=${error}`)
    } else {
        next()
    }

}

router.get('/', Controller.getProduct) // 
router.get('/buy/:id', isLogin, Controller.renderBuyProduct)
router.get('/sell', isLogin, isAdmin, Controller.renderAddProduct)
router.post('/sell', Controller.addProductHandler)
router.get('/detail/:id', Controller.productDetail)
router.get('/qrcode/:id', Controller.qrCode)
router.get('/update/:id', isLogin, isAdmin, Controller.updateProductPage)
router.post('/update/:id', Controller.updateProductHandler)
router.get('/delete/:id', isLogin, isAdmin, Controller.deleteProduct)

module.exports = router
