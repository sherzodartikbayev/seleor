const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const transactionModel = require("../models/transaction.model");
const userModel = require("../models/user.model");
const bcrypt = require('bcrypt')

class UserController {
    // [GET] /products
    async getProducts(req, res, next) {
        try {
            const products = await productModel.find().lean()
            if (!products) return res.status(404).json({ message: "Products not found" })

            return res.status(200).json({ message: "Products successfully get", products })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [GET] /product/:id
    async getProduct(req, res, next) {
        try {
            const { id } = req.params

            const product = await productModel.findById(id)
            if (!product) return res.status(404).json({ message: "Product not found" })

            return res.status(200).json({ message: "Product successfully get", product })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [GET] /profile/:id
    async getProfile(req, res, next) {
        try {
            const profile = await userModel.findById(req.params.id)
            if (!profile) return res.status(404).json({ message: "Profile not found" })

            return res.status(200).json({ message: "Profile successfully get", profile })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [GET] /orders
    async getOrders(req, res, next) {
        try {
            const userId = '6a60fb3285d431b959bc48e4'
            const orders = await orderModel.find({ user: userId })

            if (!orders) return res.status(404).json({ message: "Order not found" })

            return res.status(200).json({ message: "Orders successfully get", orders })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [GET] /transactions
    async getTransactions(req, res, next) {
        try {
            const userId = '6a60fb3285d431b959bc48e4'
            const transactions = await transactionModel.find({ user: userId })

            if (!transactions) return res.status(404).json({ message: "Transactions not found" })

            return res.status(200).json({ message: "Transactions succussfully get", transactions })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [GET] /favorites
    async getFavorites(req, res, next) {
        try {
            const userId = '6a60fb3285d431b959bc48e4'
            const user = await userModel.findById(userId).populate('favorites')

            if (!user) return res.status(404).json({ message: "User not found" })

            return res.status(200).json({
                message: "Favorites successfully get",
                favorites: user.favorites
            })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [GET] /statistics
    async getStatistics(req, res, next) {
        try {
            const userId = '6a60fb3285d431b959bc48e4'
            const user = await userModel.findById(userId)

            if (!user) return res.status(404).json({ message: "User not found" })

            const totalOrders = await orderModel.countDocuments({ user: user._id })
            const totalTransactions = await transactionModel.countDocuments({ user: user._id })
            const totalFavourites = user.favorites.length

            return res.status(200).json({ totalOrders, totalTransactions, totalFavourites })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [POST] /add-favorite
    async addFavorite(req, res, next) {
        try {
            const { productId } = req.body

            const userId = '6a60fb3285d431b959bc48e4'
            const user = await userModel.findById(userId)
            if (!user) return res.status(404).json({ message: "User not found" })
            user.favorites.push(productId)
            await user.save()

            return res.status(200).json(user)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [PUT] /update-profile
    async updateProfile(req, res, next) {
        try {
            const userId = '6a60fb3285d431b959bc48e4'
            const user = await userModel.findById(userId)
            if (!user) return res.status(404).json({ message: "User not found" })

            user.set(req.body)
            await user.save()

            return res.status(200).json({ message: "Profile successfully updated", user })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [PUT] /update-password
    async updatePassword(req, res, next) {
        try {
            const { oldPassword, newPassword } = req.body

            const userId = '6a60fb3285d431b959bc48e4'
            const user = await userModel.findById(userId)

            if (!user) return res.status(404).json({ message: "User not found" })

            const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)
            if (!isPasswordMatch) return res.status(400).json({ message: 'Old password is incorrect' })

            const hashedPassword = await bcrypt.hash(newPassword, 10)
            await userModel.findByIdAndUpdate(userId, { password: hashedPassword })

            return res.status(200).json({ message: 'Password successfully updated' })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [DELETE] /user/delete-favorite/:id
    async deleteFavorite(req, res, next) {
        try {
            const { id } = req.params

            const userId = '6a60fb3285d431b959bc48e4'
            const user = await userModel.findById(userId)
            if (!user) return res.status(404).json({ message: "User not found" })

            user.favorites.pull(id)
            await user.save()

            return res.status(200).json({ message: 'Product removed from favorites' })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}

module.exports = new UserController()