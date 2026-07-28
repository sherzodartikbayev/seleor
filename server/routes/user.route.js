const userController = require("../controllers/user.controller")
const userMiddleware = require("../middlewares/user.middleware")

const router = require("express").Router()

router.get('/products', userController.getProducts)
router.get('/product/:id', userController.getProduct)
router.get('/profile/:id', userController.getProfile)
router.get('/orders', userController.getOrders)
router.get('/transactions', userController.getTransactions)
router.get('/favorites', userController.getFavorites)
router.get('/statistics', userController.getStatistics)

router.post('/favorite', userMiddleware, userController.addFavorite)

router.put('/password', userController.updatePassword)
router.put('/profile', userController.updateProfile)

router.delete('/favorite/:id', userController.deleteFavorite)

module.exports = router