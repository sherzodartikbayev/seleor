const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const transactionModel = require("../models/transaction.model");
const userModel = require("../models/user.model");

class AdminController {
    // [GET] /products
    async getAllProducts(req, res, next) {
        try {
            const userId = "6a60fb3285d431b959bc48e4"
            const user = await userModel.findById(userId)
            if (!user) return res.status(404).json({ failure: "User not found" })
            if (!user.role === "admin") return res.status(400).json({ failure: "User is not admin" })

            const products = await productModel.find().lean()
            if (!products) {
                return res.status(404).json({ failure: "Products not found" })
            }

            return res.status(200).json(products)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [GET] /product/:id
    async getProduct(req, res, next) {
        try {
            const userId = "6a60fb3285d431b959bc48e4"
            const user = await userModel.findById(userId)
            if (!user) return res.status(404).json({ failure: "User not found" })
            if (!user.role === "admin") return res.status(400).json({ failure: "User is not admin" })

            const { id } = req.params
            const product = await productModel.findById(id)
            if (!product) return res.status(404).json({ failure: "Product not found" })

            return res.status(200).json(product)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [GET] /customers
    async getCustomers(req, res, next) {
        try {
            const userId = "6a60fb3285d431b959bc48e4"
            const user = await userModel.findById(userId)
            if (!user) return res.status(404).json({ failure: "User not found" })
            if (!user.role === "admin") return res.status(400).json({ failure: "User is not admin" })

            const customers = await userModel.find({ role: "user" })
            if (!customers) return res.status(404).json({ failure: "Customers not found" })

            return res.status(200).json({ message: "Successfully get customers", customers })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [GET] /orders
    async getOrders(req, res, next) {
        try {
            const userId = "6a60fb3285d431b959bc48e4"
            const user = await userModel.findById(userId)
            if (!user) return res.status(404).json({ failure: "User not found" })
            if (!user.role === "admin") return res.status(400).json({ failure: "User is not admin" })

            const orders = await orderModel.find().lean()
            if (!orders) return res.status(404).json({ failure: "Orders not found" })

            return res.status(200).json({ message: "Successfully get orders", orders })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [GET] /admin/transactions
    async getTransactions(req, res, next) {
        try {
            const userId = "6a60fb3285d431b959bc48e4"
            const user = await userModel.findById(userId)
            if (!user) return res.status(404).json({ failure: "User not found" })
            if (!user.role === "admin") return res.status(400).json({ failure: "User is not admin" })

            const transactions = await transactionModel.find().lean()
            if (!transactions) return res.status(404).json({ failure: "Orders not found" })

            return res.status(200).json({ message: "Successfully get customers", transactions })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    // [POST] /product
    async createProduct(req, res, next) {
        try {
            const data = req.body

            const userId = "6a60fb3285d431b959bc48e4"
            const user = await userModel.findById(userId)
            if (!user) return res.status(404).json({ failure: "User not found" })
            if (!user.role === "admin") return res.status(400).json({ failure: "User is not admin" })

            const newProduct = await productModel.create(data)

            if (!newProduct) return res.status(400).json({ failure: "Failure while creating product" })

            return res.status(200).json({ message: "Product successfully created" })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    // [PUT] /product/:id
    async updateProduct(req, res, next) {
        try {
            const data = req.body
            const { id } = req.params

            const userId = "6a60fb3285d431b959bc48e4"
            const user = await userModel.findById(userId)
            if (!user) return res.status(404).json({ failure: "User not found" })
            if (!user.role === "admin") return res.status(400).json({ failure: "User is not admin" })

            const updatedProduct = await productModel.findByIdAndUpdate(id, data, { new: true })
            if (!updatedProduct) return res.status(400).json({ failure: "Failure while updating product" })

            return res.status(200).json({ message: "Product successfully updated" })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [PUT] /order/:id
    async updateOrder(req, res, next) {
        try {
            const { status } = req.body
            const id = req.params

            const userId = "6a60fb3285d431b959bc48e4"
            const user = await userModel.findById(userId)
            if (!user) return res.status(404).json({ failure: "User not found" })
            if (!user.role === "admin") return res.status(400).json({ failure: "User is not admin" })

            const updatedOrder = await orderModel.findByIdAndUpdate(id, { status })
            if (!updatedOrder) return res.status(404).json({ failure: "Order not found" })

            return res.status(200).json({ message: "Order successfully updated", updatedOrder })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [DELETE] /product/:id
    async deleteProduct(req, res, next) {
        try {
            const { id } = req.params

            const userId = "6a60fb3285d431b959bc48e4"
            const user = await userModel.findById(userId)
            if (!user) return res.status(404).json({ failure: "User not found" })
            if (!user.role === "admin") return res.status(400).json({ failure: "User is not admin" })

            const deletedProduct = await productModel.findByIdAndDelete(id)
            if (!deletedProduct) return res.status(400).json({ failure: "Failure while deleting product" })

            return res.status(200).json({ message: "Product successfully deleted." })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

module.exports = new AdminController()