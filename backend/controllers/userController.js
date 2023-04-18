const catchAsyncErrors = require('../middlewear/catchAsyncErrors');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/ErrorHandler');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
//register 
exports.registerUser =catchAsyncErrors( async(req,res)=>{
    
    // const isEmailExist = await User.find(req.body.email);
    // if(isEmailExist){
    //     return next(new ErrorHandler("Email existed!",404));
    // }
    const user = await User.create(req.body);
    const token = user.getJWTToken();
    sendToken(user, 201, res)
});
//login
exports.login = async(req,res,next)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email and password",404));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid Email Or Password",404));
    }
    console.log(await bcrypt.hash(password,10))
    const isPasswordMatched = await user.comparePassword(password);
    
    console.log(isPasswordMatched);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email Or Password",404));
    }
    console.log(isPasswordMatched)
    const token = user.getJWTToken();

    sendToken(user, 200,res)   
}
//logout
exports.logout = catchAsyncErrors(async (req, res,next)=>{
    console.log(res.cookie)
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly:true
    })
    console.log(res.cookie);
    res.status(200).json({
        success:true,
        message: "Logged out"
    });
});
//Forgot password
exports.forgotPassword = catchAsyncErrors(async (req,res,next)=>{
    const user = await User.findOne({email:req.body.email});
    console.log(user)
    if(!user){
        return next(new ErrorHandler("User not found",404))
        }
        // Get resetPassword Token
        const resetToken = user.getResetToken();
        await user.save({validateBeforeSave: false});
        const resetPasswordUrl = `${req.protocol}://${req.get(
            "host"
        )}/api/v2/password/reset/${resetToken}`
        const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it`
        try {
            await sendEmail({
                email:user.email,
                subject:`Ecommerce Password Recovery`,
                message
            })
            res.status(200).json({
                success:true,
                message: "Recovery Email sent"
            })
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;;
            await user.save({validateBeforeSave: false});
            return next(new ErrorHandler(error.message,500));
        }
    })
//Reset Password
exports.resetPassword = catchAsyncErrors( async (req, res,next)=>{
    // creating token hash
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt: Date.now(),
        }
    });
    console.log(user)
    if(!user){
        return next(new ErrorHandler("Password reset token invalid or has been expire",400))
    }
    if(req.body.password !== req.body.confirmPassword){
        return next (new ErrorHandler("Password does not password",400))
    };
    console.log(req.body.password);
    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save();
    sendToken(user, 200, res);
})