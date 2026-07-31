const userController = require("../controllers/user.controller")
const userMiddleware = require("../middlewares/user.middleware")

const router = require("express").Router()

router.get('/products', userController.getProducts)
router.get('/product/:id', userController.getProduct)
router.get('/profile/:id', userController.getProfile)
router.get('/orders', userMiddleware, userController.getOrders)
router.get('/transactions', userMiddleware, userController.getTransactions)
router.get('/favorites', userMiddleware, userController.getFavorites)
router.get('/statistics', userMiddleware, userController.getStatistics)

router.post('/favorite', userMiddleware, userController.addFavorite)
router.post('/stripe/checkout', userMiddleware, userController.stripeCheckout)

router.put('/profile', userMiddleware, userController.updateProfile)
router.put('/password', userMiddleware, userController.updatePassword)

router.delete('/favorite/:id', userMiddleware, userController.deleteFavorite)

module.exports = router