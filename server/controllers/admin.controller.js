const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const transactionModel = require("../models/transaction.model");
const userModel = require("../models/user.model");

class AdminController {
    // [GET] /products
    async getAllProducts(req, res, next) {
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

            return res.status(200).json(product)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [GET] /customers
    async getCustomers(req, res, next) {
        try {
            const { searchQuery, filter, page, pageSize } = req.query
            const skipAmount = (+page - 1) * +pageSize
            const query = {}
            if (searchQuery) {
                const escapedSearchQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                query.$or = [
                    { fullName: { $regex: new RegExp(escapedSearchQuery, 'i') } },
                    { email: { $regex: new RegExp(escapedSearchQuery, 'i') } }
                ]
            }

            let sortOptions = { createdAt: -1 }
            if (filter === "newest") sortOptions = { createdAt: -1 }
            else if (filter === "oldest") sortOptions = { createdAt: 1 }

            const customers = await userModel.aggregate([
                { $match: query },
                { $lookup: { from: 'orders', localField: '_id', foreignField: 'user', as: 'orders' } },
                { $addFields: { orderCount: { $size: '$orders' } } },
                { $unwind: { path: '$orders', preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        _id: '$_id',
                        email: { $first: '$email' },
                        fullName: { $first: '$fullName' },
                        role: { $first: '$role' },
                        createdAt: { $first: '$createdAt' },
                        updatedAt: { $first: '$updatedAt' },
                        totalPrice: { $sum: '$orders.price' },
                        orderCount: { $first: '$orderCount' },
                        isDeleted: { $first: '$isDeleted' }
                    }
                },
                { $sort: sortOptions },
                { $skip: skipAmount },
                { $limit: +pageSize }
            ])

            const totalCustomers = await userModel.countDocuments(query)
            const isNext = totalCustomers > skipAmount + +customers.length

            if (!customers) return res.status(404).json({ failure: "Customers not found" })

            return res.status(200).json({ customers, isNext })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [GET] /orders
    async getOrders(req, res, next) {
        try {
            const { searchQuery, filter, page, pageSize } = req.query
            const skipAmount = (page - 1) * pageSize
            const query = {}

            if (searchQuery) {
                const escapedSearchQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                query.$or = [
                    { 'user.fullName': { $regex: new RegExp(escapedSearchQuery, 'i') } },
                    { 'user.email': { $regex: new RegExp(escapedSearchQuery, 'i') } },
                    { 'product.title': { $regex: new RegExp(escapedSearchQuery, 'i') } },
                ]
            }

            let sortOptions = { createdAt: -1 }
            if (filter === 'newest') sortOptions = { createdAt: -1 }
            else if (filter === 'oldest') sortOptions = { createdAt: 1 }

            const orders = await orderModel.aggregate([
                { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
                { $unwind: '$user' },
                { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'product' } },
                { $unwind: '$product' },
                { $match: query },
                { $sort: sortOptions },
                { $skip: skipAmount },
                { $limit: +pageSize },
                {
                    $project: {
                        'user.email': 1,
                        'user.fullName': 1,
                        'product.title': 1,
                        price: 1,
                        createdAt: 1,
                        status: 1,
                    },
                },
            ])

            const totalOrders = await orderModel.countDocuments(query)
            const isNext = totalOrders > skipAmount + +orders.length

            if (!orders) return res.status(404).json({ failure: "Orders not found" })

            return res.status(200).json({ orders, isNext })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // [GET] /admin/transactions
    async getTransactions(req, res, next) {
        try {
            const { searchQuery, filter, page, pageSize } = req.query
            const skipAmount = (page - 1) * pageSize
            const query = {}

            if (searchQuery) {
                const escapedSearchQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                query.$or = [
                    { 'user.fullName': { $regex: new RegExp(escapedSearchQuery, 'i') } },
                    { 'user.email': { $regex: new RegExp(escapedSearchQuery, 'i') } },
                    { 'product.title': { $regex: new RegExp(escapedSearchQuery, 'i') } },
                ]
            }

            let sortOptions = { createdAt: -1 }
            if (filter === 'newest') sortOptions = { createdAt: -1 }
            else if (filter === 'oldest') sortOptions = { createdAt: 1 }

            const transactions = await transactionModel.aggregate([
                { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
                { $unwind: '$user' },
                { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'product' } },
                { $unwind: '$product' },
                { $match: query },
                { $sort: sortOptions },
                { $skip: skipAmount },
                { $limit: +pageSize },
                {
                    $project: {
                        'user.email': 1,
                        'user.fullName': 1,
                        'product.title': 1,
                        'product.price': 1,
                        amount: 1,
                        createdAt: 1,
                        state: 1,
                        provider: 1,
                    },
                },
            ])

            const totalTransactions = await transactionModel.countDocuments(query)
            const isNext = totalTransactions > skipAmount + +transactions.length

            return res.json({ transactions, isNext })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    // [POST] /product
    async createProduct(req, res, next) {
        try {
            const data = req.body

            const newProduct = await productModel.create(data)

            if (!newProduct) return res.status(400).json({ failure: "Failure while creating product" })

            return res.status(201).json({ status: 201 })
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

            const updatedProduct = await productModel.findByIdAndUpdate(id, data, { new: true })
            if (!updatedProduct) return res.status(400).json({ failure: "Failure while updating product" })

            return res.status(200).json({ status: 200 })
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

            const deletedProduct = await productModel.findByIdAndDelete(id)
            if (!deletedProduct) return res.status(400).json({ failure: "Failure while deleting product" })

            return res.status(200).json({ status: 200 })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

module.exports = new AdminController()