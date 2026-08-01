const mailService = require("../services/mail.service");

class OtpController {
    async sendOtp(req, res, next) {
        try {
            const { email } = req.body
            await mailService.sendOtpMail(email)
            return res.status(200).json({ status: 200 })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    async verifyOtp(req, res, next) {
        try {
            const { email, otp } = req.body
            const result = await mailService.verifyOtp(email, otp)
            res.status(200).json(result)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}

module.exports = new OtpController()