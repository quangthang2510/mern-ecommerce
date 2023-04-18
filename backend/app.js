const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
app.use(express.json());
app.use(cookieParser());
//Middlewear Import 
const error = require('./middlewear/error')
//Routes Import
const product = require('./routes/productRouter');
const user = require('./routes/userRouter')
app.use('/api/v2',product)
app.use('/api/v2',user)
//Middlewear for Errors
app.use(error)
module.exports = app;