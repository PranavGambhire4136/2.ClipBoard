const mongoose = require("mongoose");

const stringSchema = new mongoose.Schema({
    string: {
        type: String,
        required: true
    },
    expiryAt: {
        type: Date,
        default: () => Date.now() + 2 * 24 * 60 * 60 * 1000,
        index: { expireAfterSeconds: 0 }
    },
    recoveryString: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("String", stringSchema);