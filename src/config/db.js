const mongoose = require('mongoose');
const { mongoUrl } = require('../secret');

const connectDB = (options={})=>{
    try {
        mongoose.connect(mongoUrl,options);
        console.log('Connected to mongoDB');
        mongoose.connection.on('error',(error)=>{
            console.error('DB connection error', error);
        })
        
    } catch (error) {
        console.error('DB connection failed', error.toString());
    }
}


module.exports = connectDB;