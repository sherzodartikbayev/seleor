const userModel = require("../models/user.model")
const bcrypt = require('bcrypt')

class AuthController {
    async login(req, res, next) {
        try {
            const { email, password } = req.body

            const user = await userModel.findOne({ email })
            if (!user) return res.status(404).json({ message: "User not found" })

            const isValidPassword = await bcrypt.compare(password, user.password)
            if (!isValidPassword) {
                return res.status(400).json({ message: "Invalid password" })
            }

            return res.json({ user })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    async register(req, res, next) {
        try {
            const { fullName, email, password } = req.body

            const user = await userModel.findOne({ email })
            if (user) return res.status(400).json({ message: "User already exists" })

            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = await userModel.create({
                fullName, email, password: hashedPassword
            })

            return res.status(200).json({ user: newUser })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}

module.exports = new AuthController()