const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    Type: {
        type: String,
        required: true
    },
    RecoveryString: {
        type: String,
        required: true
    },
    expiryAt: {
        type: Date,
        default: () => Date.now() + 2 * 24 * 60 * 60 * 1000,
        index: { expireAfterSeconds: 0 }
    },
    location: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("File", fileSchema);