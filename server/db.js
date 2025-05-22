const mongoose = require('mongoose')

const dbConnect=async()=>{
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log(`mongodb connected successfully`);
    } catch (error) {
        console.log(`mongodb connection error ${error} `);      
    }
}
module.exports = dbConnect