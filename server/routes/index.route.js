const router = require('express').Router()

router.use('/auth', require('./auth.route'))
router.use('/otp', require('./otp.route'))
router.use('/admin', require('./admin.route'))
router.use('/user', require('./user.route'))

module.exports = router 