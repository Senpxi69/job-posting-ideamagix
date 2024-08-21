const jwt = require('jsonwebtoken')

const secret_key = "kartik vyas"

const createToken = (user) => {

    let uniqueId = Date.now().toString();

    let payload = {
        iat: Date.now(),
        email: user.email,
        unique: uniqueId
    }

    return jwt.sign(payload, secret_key, { expiresIn: '1h' })
}

const verifyToken = (token) => {
    return jwt.verify(token, secret_key)
}

module.exports = { createToken, verifyToken }