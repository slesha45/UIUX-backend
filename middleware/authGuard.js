const jwt = require('jsonwebtoken')
const User = require('../models/userModels')

const authGuard = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader){
        return res.status(400).json({
            success: false,
            message: "Please login first"
        })
    }

    const token = authHeader.split(' ')[1]

    if(!token || token === ''){
        return res.status(400).json({
            success : false,
            message : "Please provide a token"
        }) 
    }

    try {
        const decodeUserData = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decodeUserData.id).select("-password");
        if(!req.user){
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        next();

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Not Authenticated"
        })
    }
}
module.exports = {
    authGuard
}