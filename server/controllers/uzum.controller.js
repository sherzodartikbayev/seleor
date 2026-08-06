const productModel = require("../models/product.model")
const userModel = require("../models/user.model")
const uzumService = require("../services/uzum.service")

class UzumController {
    async check(req, res, next) {
        try {
            const data = await uzumService.check(req.body)
            res.status(200).json(data)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    async create(req, res, next) {
        try {
            const data = await uzumService.create(req.body)
            res.status(200).json(data)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    async confirm(req, res, next) {
        try {
            const data = await uzumService.confirm(req.body)
            res.status(200).json(data)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    async reverse(req, res, next) {
        try {
            const data = await uzumService.reverse(req.body)
            res.status(200).json(data)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    async status(req, res, next) {
        try {
            const data = await uzumService.status(req.body)
            res.status(200).json(data)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    async checkout(req, res, next) {
        try {
            const currentUser = req.user
            const { productId } = req.body
            const SERVICE_ID = process.env.UZUM_SERVICE_ID
            const product = await productModel.findById(productId)
            if (!product) return { failure: 'Product not found' }
            const user = await userModel.findById(currentUser._id)
            if (!user) return { failure: 'User not found' }
            const checkoutUrl = `https://www.uzumbank.uz/open-service?serviceId=${SERVICE_ID}&userId=${user._id}&productId=${product._id
                }&amount=${product.price * 100}`
            return res.status(200).json({ checkoutUrl, status: 200 })
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new UzumController()