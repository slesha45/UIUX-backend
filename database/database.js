const mongoose = require("mongoose")

const connectDatabase = () => {
    mongoose.connect(process.env.MONGODB_CLOUD).then(() => {
        console.log("Connected to database")
    })
}

module.exports = connectDatabase