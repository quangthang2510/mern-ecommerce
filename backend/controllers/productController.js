const Product = require("../models/productModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require('../middlewear/catchAsyncErrors');
const Features = require("../utils/Features");
//Get All Products
exports.getAllProduct =catchAsyncErrors( async (req, res)=>{
    const resultPerPage = 5;
    const productCount = Product.countDocuments();
    const apiFeature = new Features(Product.find(), req.query)
    .search()
    .filter().pagination(resultPerPage);
    const products = await apiFeature.query;
    res.status(200).json({
        success:true,
        products
    })
});
//Create New Product
exports.createProduct =catchAsyncErrors( async (req, res,next)=>{
    req.body.user = req.user.id;
const product = await Product.create(req.body);
res.status(201).json({
    success:true,
    product
})
});
// update product
exports.updateProduct = catchAsyncErrors( async (req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
      return next(new ErrorHandler("Product not found",404))
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body,{
         new:true,
         runValidators:true,
         useUnified:false,
    });
    res.status(200).json({
        success:true,
        product
    })
});
//delete product
exports.deleteProduct = async (req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }
   await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success:true,
    })
}
// Get Product Details
exports.productDetail = catchAsyncErrors( async (req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }
    res.status(200).json({
        success:true,
        product,
        productCount
    })
});