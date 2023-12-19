const app = require('./app');
const connectDB = require('./config/db');
const { serverPort } = require('./secret');


app.listen(serverPort, async()=>{
    console.log(`Server running at port ${serverPort}`);
    await connectDB();
});