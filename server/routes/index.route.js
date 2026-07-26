const adminMiddleware = require('../middlewares/admin.middleware')

const router = require('express').Router()

router.use('/auth', require('./auth.route'))
router.use('/otp', require('./otp.route'))
router.use('/admin', adminMiddleware, require('./admin.route'))
router.use('/user', require('./user.route'))

module.exports = router 