const otpController = require('../controllers/otp.controller')

const router = require('express').Router()

router.post('/send-otp', otpController.sendOtp)
router.post('/verify-otp', otpController.verifyOtp)
router.post('/resend-otp', otpController.resendOtp)

module.exports = router 