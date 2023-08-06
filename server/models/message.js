const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: {type: String, required: true, maxLength: 100},
    message: {type: String, required: true, maxLength: 250},
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    timestamp: {type: Date, default: Date.now},
})

module.exports = mongoose.model("Message", MessageSchema);