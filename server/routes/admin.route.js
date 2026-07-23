const adminController = require('../controllers/admin.controller')

const router = require('express').Router()

router.get('/products', adminController.getAllProducts)
router.get('/product/:id', adminController.getProduct)
router.get('/customers', adminController.getCustomers)
router.get('/orders', adminController.getOrders)
router.get('/transactions', adminController.getTransactions)

router.post('/product', adminController.createProduct)

router.put('/product/:id', adminController.updateProduct)
router.put('/order/:id', adminController.updateOrder)

router.delete('/product/:id', adminController.deleteProduct)

module.exports = router 