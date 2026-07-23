const mailService = require("../services/mail.service");

class OtpController {
    async sendOtp(req, res, next) {
        try {
            const { email } = req.body
            await mailService.sendOtpMail(email)
            return res.status(200).json({ message: "OTP sent successfully" })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    async verifyOtp(req, res, next) {
        try {
            const { email, otp } = req.body
            const result = await mailService.verifyOtp(email, otp)
            if (result.failure) return res.json({ message: result.failure })
            res.json({ message: "OTP verified successfully" })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    resendOtp() {

    }
}

module.exports = new OtpController()