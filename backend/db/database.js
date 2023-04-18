const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connect = async ()=>{
    try {
        await mongoose.connect(process.env.DB_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log("Database connected")
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}
//yi!4tr4EN@c6EJ3
module.exports = connect