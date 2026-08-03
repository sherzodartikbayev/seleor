require('dotenv').config()

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { default: mongoose } = require('mongoose')
const errorMiddleware = require('./middlewares/error.middleware')
const { rateLimit } = require('express-rate-limit')
const stripeController = require('./controllers/stripe.controller')
const app = express()

// Webhook
app.post('/webhook/stripe', express.raw({ type: 'application/json' }), stripeController.webhook)

// Middleware
app.use(rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 200,
    standardHeaders: 'draft-7',
    legacyHeaders: false
}))
app.use(express.json())
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))

// Routes
app.use('/api', require('./routes/index.route'))

// Error handling
app.use(errorMiddleware)

const bootstrap = async () => {
    const PORT = process.env.PORT || 5000
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('Connected to DB!'))
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    })
}

bootstrap()