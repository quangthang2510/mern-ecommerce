const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
exports.isAuthenticatedUser = catchAsyncErrors(async (req,res,next)=>{
    const {token} = req.cookies;
    // console.log(token)
    if(!token){
        return next (new ErrorHandler("Please login to access this resources",401))
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.id);
    // console.log(req.user)
    next();
});
exports.authorizeRoles = (...roles)=>{
    return (req, res,next)=>{
    if(!roles.includes(req.user.role)){
        return next(new ErrorHandler(`Role ${req.user.role} is not allow to access resouce` ,403))
    }
    next();
    }
}