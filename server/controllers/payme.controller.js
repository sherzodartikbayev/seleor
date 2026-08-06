const { PaymeMethod } = require("../enum/transaction.enum")
const productModel = require("../models/product.model")
const userModel = require("../models/user.model")
const paymeService = require("../services/payme.service")
const base64 = require('base-64')

class PaymeController {
    async payme(req, res, next) {
        try {
            const { method, params, id } = req.body

            switch (method) {
                case PaymeMethod.CheckPerformTransaction: {
                    await paymeService.checkPerformTransaction(params, id)
                    return res.json({ result: { allow: true } })
                }
                case PaymeMethod.CheckTransaction: {
                    const result = await paymeService.checkTransaction(params, id)
                    return res.json({ result, id })
                }
                case PaymeMethod.CreateTransaction: {
                    const result = await paymeService.createTransaction(params, id)
                    return res.json({ result, id })
                }
                case PaymeMethod.PerformTransaction: {
                    const result = await paymeService.performTransaction(params, id)
                    return res.json({ result, id })
                }
                case PaymeMethod.CancelTransaction: {
                    const result = await paymeService.cancelTransaction(params, id)
                    return res.json({ result, id })
                }
                case PaymeMethod.GetStatement: {
                    const result = await paymeService.getStatement(params, id)
                    return res.json({ result: { transactions: result } })
                }
            }
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    async checkout(req, res, next) {
        try {
            const currentUser = req.user
            const { productId } = req.body
            const MERCHANT_ID = process.env.PAYME_MERCHANT_ID
            const PAYME_CHECKOUT_LINK = process.env.PAYME_CHECKOUT_LINK

            const product = await productModel.findById(productId)
            if (!product) return res.status(404).json({ failure: "Product not found" })

            const user = await userModel.findById(currentUser._id)
            if (!user) return res.status(404).json({ failure: "User not found" })

            const callbaclUrl = `${process.env.CLIENT_URL}/success?productId=${product._id}&userId=${currentUser._id}`
            const price = product.price * 100
            const r = base64.encode(`m=${MERCHANT_ID};ac.user_id=${user.id};ac.product_id=${product.id};a=${price};c=${callbaclUrl}`)
            const checkoutUrl = `${PAYME_CHECKOUT_LINK}/${r}`

            return res.status(200).json({ status: 200, checkoutUrl })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}

module.exports = new PaymeController()