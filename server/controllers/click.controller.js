const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const userModel = require("../models/user.model");
const clickService = require("../services/click.service");

class ClickController {
    async prepare(req, res, next) {
        try {
            const result = await clickService.prepare(req.body)
            res.set({ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).send(result)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    async complete(req, res, next) {
        try {
            const result = await clickService.complete(req.body)
            res.set({ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).send(result)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    async checkout(req, res, next) {
        try {
            const currentUser = req.user
            const { productId, url } = req.body

            const MERCHANT_ID = process.env.CLICK_MERCHANT_ID
            const SERVICE_ID = process.env.CLICK_SERVICE_ID
            const MERCHANT_USER_ID = process.env.CLICK_MERCHANT_USER_ID

            const product = await productModel.findById(productId)
            if (!product) return { failure: "Product not found" }

            const user = await userModel.findById(currentUser._id)
            if (!user) return { failure: "User not found" }

            await orderModel.deleteMany({ user: user._id, product: product._id, status: 'Pending confirm', provider: 'click' })
            const order = await orderModel.create({ user: user._id, product: product._id, price: product.price, provider: 'click' })

            const checkoutUrl = `https://my.click.uz/services/pay?service_id=${SERVICE_ID}&merchant_id=${MERCHANT_ID}&amount=${product.price}&transaction_param=${order._id}&merchant_order_id=${MERCHANT_USER_ID}&return_url=${url}`

            return res.status(200).json({ url: checkoutUrl })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}

module.exports = new ClickController()