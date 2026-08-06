const paymeController = require('../controllers/payme.controller')
const { paymeCheckToken } = require('../middlewares/payme.middleware')
const userMiddleware = require('../middlewares/user.middleware')

const router = require('express').Router()

router.post('/payment', paymeCheckToken, paymeController.payme)
router.post('/checkout', userMiddleware, paymeController.checkout)

module.exports = router 