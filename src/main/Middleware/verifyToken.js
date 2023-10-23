import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
    try {
        const tokenSecret = process.env.TOKEN_SECRET
        const authorizationHeader = req.headers.authorization
        const token = authorizationHeader.split(' ')[1]
        jwt.verify(token, tokenSecret)
        return next()
    } catch (err) {
        res.status(401)
        res.json('Access denied, invalid token')
    }
}
export default verifyToken