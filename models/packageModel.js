const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema ({
    packageTitle: {
        type: String,
        required: true
    },
    packageDescription: {
        type: String,
        required: true
    },
    packagePrice: {
        type: Number,
        required: true
    },
    packageImage: {
        type: String,
        required: true
    }
})

const Package = mongoose.model('packages', packageSchema)
module.exports = Package;