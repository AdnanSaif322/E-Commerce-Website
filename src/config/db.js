const mongoose = require('mongoose');
const { mongoUrl } = require('../secret');
const logger = require('../controllers/loggerController');

const connectDB = (options={})=>{
    try {
        mongoose.connect(mongoUrl,options);
        logger.log('info','Connected to mongoDB');
        mongoose.connection.on('error',(error)=>{
            logger.log('error','DB connection error', error);
        })
        
    } catch (error) {
        logger.log('error','DB connection failed', error.toString());
    }
}


module.exports = connectDB;