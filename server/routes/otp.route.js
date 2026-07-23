const otpController = require('../controllers/otp.controller')

const router = require('express').Router()

router.post('/send', otpController.sendOtp)
router.post('/verify', otpController.verifyOtp)
router.post('/resend', otpController.resendOtp)

module.exports = router 