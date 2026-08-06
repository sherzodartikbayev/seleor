const BaseError = require("../errors/base.error")

module.exports = function (error, req, res, next) {
    if (error.isTransactionError) {
        return res.json({
            error: {
                code: error.transactionErrorCode,
                message: error.transactionErrorMessage,
                data: error.transactionData,
            },
            id: error.transactionId,
        })
    }


    if (error instanceof BaseError) {
        return res.status(error.status).json({
            message: error.message,
            errors: error.errors
        })
    }

    return res.status(500).json({ message: error.message })
}
