const adminController = require('../controllers/admin.controller')

const router = require('express').Router()

router.get('/products', adminController.getAllProducts)
router.get('/product/:id', adminController.getProduct)
router.post('/product', adminController.createProduct)
router.put('/product/:id', adminController.updateProduct)
router.delete('/product/:id', adminController.deleteProduct)

module.exports = router 