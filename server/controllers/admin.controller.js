const productModel = require("../models/product.model");
const userModel = require("../models/user.model");

class AdminController {
    // [GET] /products
    async getAllProducts(req, res, next) {
        try {
            const userId = "6a60fb3285d431b959bc48e4"
            const user = await userModel.findById(userId)
            if (!user) return res.status(404).json({ message: "User not found" })
            if (!user.role === "admin") return res.status(400).json({ message: "User is not admin" })

            const products = await productModel.find().lean()
            if (!products) {
                return res.status(404).json({ message: "Products not found" })
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
            if (!user) return res.status(404).json({ message: "User not found" })
            if (!user.role === "admin") return res.status(400).json({ message: "User is not admin" })

            const { id } = req.params
            const product = await productModel.findById(id)
            if (!product) {
                return res.status(404).json({ message: "Product not found" })
            }

            return res.status(200).json(product)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [POST] /product
    async createProduct(req, res, next) {
        try {
            const data = req.body
            const userId = "6a60fb3285d431b959bc48e4"

            const user = await userModel.findById(userId)
            if (!user) return res.status(404).json({ message: "User not found" })
            if (!user.role === "admin") return res.status(400).json({ message: "User is not admin" })

            const newProduct = await productModel.create(data)

            if (!newProduct) return res.status(400).json({ message: "Failure while creating product" })

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
            if (!user) return res.status(404).json({ message: "User not found" })
            if (!user.role === "admin") return res.status(400).json({ message: "User is not admin" })

            const updatedProduct = await productModel.findByIdAndUpdate(id, data, { new: true })
            if (!updatedProduct) return res.status(400).json({ message: "Failure while updating product" })

            return res.status(200).json({ message: "Product successfully updated" })
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
            if (!user) return res.status(404).json({ message: "User not found" })
            if (!user.role === "admin") return res.status(400).json({ message: "User is not admin" })

            const deletedProduct = await productModel.findByIdAndDelete(id)
            if (!deletedProduct) return res.status(400).json({ message: "Failure while deleting product" })

            return res.status(200).json({ message: "Product successfully deleted." })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    static async protectRoute(req, res, next) {
        const userId = "6a60fb3285d431b959bc48e4"
        const user = await userModel.findById(userId)
        if (!user) return res.status(404).json({ message: "User not found" })
        if (!user.role === "admin") return res.status(400).json({ message: "User is not admin" })
        next()
    }
}

module.exports = new AdminController()