const { getCustomer } = require("../libs/customer");
const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const transactionModel = require("../models/transaction.model");
const userModel = require("../models/user.model");
const bcrypt = require('bcrypt');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

class UserController {
    // [GET] /products
    async getProducts(req, res, next) {
        try {
            const { searchQuery, filter, category, page, pageSize } = req.query
            const skipAmount = (+page - 1) * +pageSize
            const query = {}
            if (searchQuery) {
                const escapedSearchQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                query.$or = [{ title: { $regex: new RegExp(escapedSearchQuery, 'i') } }]
            }

            if (category === 'All') query.category = { $exists: true }
            else if (category !== 'All') {
                if (category) query.category = category
            }

            let sortOptions = { createdAt: -1 }
            if (filter === "newest") sortOptions = { createdAt: -1 }
            else if (filter === "oldest") sortOptions = { createdAt: 1 }


            const products = await productModel.find(query).lean().sort(sortOptions).skip(skipAmount).limit(+pageSize)
            if (!products) {
                return res.status(404).json({ failure: "Products not found" })
            }

            const totalProducts = await productModel.countDocuments(query)
            const isNext = totalProducts > skipAmount + +products.length

            return res.status(200).json({ products, isNext })
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
            if (!product) return res.status(404).json({ failure: "Product not found" })

            return res.status(200).json({ message: "Product successfully get", product })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [GET] /profile/:id
    async getProfile(req, res, next) {
        try {
            const user = await userModel.findById(req.params.id).select('-password')
            if (!user) return res.status(404).json({ failure: "Profile not found" })

            return res.status(200).json({ message: "Profile successfully get", user })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [GET] /orders
    async getOrders(req, res, next) {
        try {
            const currentUser = req.user
            const { searchQuery, filter, page, pageSize } = req.query
            const skipAmount = (page - 1) * pageSize

            const matchQuery = { user: currentUser._id }

            if (searchQuery) {
                const escapedSearchQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                matchQuery.$or = [{ 'product.title': { $regex: new RegExp(escapedSearchQuery, 'i') } }]
            }

            let sortOptions = { createdAt: -1 }
            if (filter === 'newest') sortOptions = { createdAt: -1 }
            else if (filter === 'oldest') sortOptions = { createdAt: 1 }

            const orders = await orderModel.aggregate([
                { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'product' } },
                { $unwind: '$product' },
                { $match: matchQuery },
                { $sort: sortOptions },
                { $skip: skipAmount },
                { $limit: +pageSize },
                {
                    $project: {
                        'product.title': 1,
                        createdAt: 1,
                        updatedAt: 1,
                        price: 1,
                        status: 1,
                    }
                }
            ])

            const totalOrders = await orderModel.countDocuments(matchQuery)
            const isNext = totalOrders > skipAmount + orders.length

            return res.status(200).json({ orders, isNext })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [GET] /transactions
    async getTransactions(req, res, next) {
        try {
            const currentUser = req.user
            const { searchQuery, filter, page, pageSize } = req.query
            const skipAmount = (page - 1) * pageSize

            const matchQuery = { user: currentUser._id }

            if (searchQuery) {
                const escapedSearchQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                matchQuery.$or = [{ 'product.title': { $regex: new RegExp(escapedSearchQuery, 'i') } }]
            }

            let sortOptions = { createdAt: -1 }
            if (filter === 'newest') sortOptions = { createdAt: -1 }
            else if (filter === 'oldest') sortOptions = { createdAt: 1 }

            const transactions = await transactionModel.aggregate([
                { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'product' } },
                { $unwind: '$product' },
                { $match: matchQuery },
                { $sort: sortOptions },
                { $skip: skipAmount },
                { $limit: +pageSize },
                {
                    $project: {
                        'product.title': 1,
                        amount: 1,
                        state: 1,
                        provider: 1,
                        created_time: 1,
                        perform_time: 1,
                        cancel_time: 1,
                        reason: 1,
                    }
                }
            ])

            const totalTransactions = await transactionModel.countDocuments(matchQuery)
            const isNext = totalTransactions > skipAmount + transactions.length

            return res.status(200).json({ transactions, isNext })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [GET] /favorites
    async getFavorites(req, res, next) {
        try {
            const currentUser = req.user
            const { searchQuery, filter, page, pageSize, category } = req.query
            const skipAmount = (page - 1) * pageSize

            const user = await userModel.findById(currentUser._id)
            const matchQuery = { _id: { $in: user.favorites } }

            if (searchQuery) {
                const escapedSearchQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                matchQuery.$or = [{ title: { $regex: new RegExp(escapedSearchQuery, 'i') } }]
            }

            if (category === 'All') matchQuery.category = { $exists: true }
            else if (category !== 'All') {
                if (category) matchQuery.category = category
            }

            let sortOptions = {}
            if (filter === 'newest') sortOptions = { createdAt: -1 }
            else if (filter === 'oldest') sortOptions = { createdAt: 1 }

            const products = await productModel.find(matchQuery).sort(sortOptions).skip(skipAmount).limit(+pageSize)

            const totalProducts = await productModel.countDocuments(matchQuery)
            const isNext = totalProducts > skipAmount + +products.length

            return res.json({ products, isNext })
        } catch (error) {
            next(error)
        }
    }

    // [GET] /statistics
    async getStatistics(req, res, next) {
        try {
            const userId = req.user._id
            const user = await userModel.findById(userId)

            if (!user) return res.status(404).json({ failure: "User not found" })

            const totalOrders = await orderModel.countDocuments({ user: user._id })
            const totalTransactions = await transactionModel.countDocuments({ user: user._id })
            const totalFavourites = user.favorites.length
            const statistics = { totalOrders, totalTransactions, totalFavourites }

            return res.status(200).json({ statistics })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [POST] /favorite
    async addFavorite(req, res, next) {
        try {
            const { productId } = req.body
            const userId = req.user._id

            const isExist = await userModel.findOne({ _id: userId, favorites: productId })
            if (isExist) return res.status(400).json({ failure: 'Product already in favorites' })

            await userModel.findByIdAndUpdate(userId, { $push: { favorites: productId } })

            return res.status(200).json({ status: 200 })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    async stripeCheckout(req, res, next) {
        try {
            const { productId } = req.body
            const currentUser = req.user

            const customer = await getCustomer(currentUser._id)
            const product = await productModel.findById(productId)

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                customer: customer.id,
                mode: 'payment',
                metadata: { productId: product._id.toString(), userId: currentUser._id.toString() },
                line_items: [{ price: product.stripePriceId, quantity: 1 }],
                success_url: `${process.env.CLIENT_URL}/success?productId=${product._id}&userId=${currentUser._id}`,
                cancel_url: `${process.env.CLIENT_URL}/cancel?productId=${product._id}&userId=${currentUser._id}`,
                payment_intent_data: {
                    metadata: { productId: product._id.toString(), userId: currentUser._id.toString() },
                },
            })

            return res.status(200).json({ status: 200, checkoutUrl: session.url })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [PUT] /profile
    async updateProfile(req, res, next) {
        try {
            const userId = req.user._id

            const user = await userModel.findById(userId)
            if (!user) return res.status(404).json({ failure: "User not found" })
            await userModel.findByIdAndUpdate(userId, req.body)

            return res.status(200).json({ status: 200 })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [PUT] /password
    async updatePassword(req, res, next) {
        try {
            const { oldPassword, newPassword } = req.body

            const userId = req.user._id
            const user = await userModel.findById(userId)

            if (!user) return res.status(404).json({ failure: "User not found" })

            const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)
            if (!isPasswordMatch) return res.status(400).json({ failure: 'Old password is incorrect' })

            const hashedPassword = await bcrypt.hash(newPassword, 10)
            await userModel.findByIdAndUpdate(userId, { password: hashedPassword })

            return res.status(200).json({ status: 200 })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [DELETE] /favorite/:id
    async deleteFavorite(req, res, next) {
        try {
            const { id } = req.params
            const userId = req.user._id

            const user = await userModel.findById(userId)
            if (!user) return res.status(404).json({ failure: "User not found" })

            user.favorites.pull(id)
            await user.save()

            return res.status(200).json({ status: 200 })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}

module.exports = new UserController()