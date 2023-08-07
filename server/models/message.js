const mongoose = require("mongoose");
const {DateTime} = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: {type: String, required: true, maxLength: 100},
    message: {type: String, required: true, maxLength: 250},
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    timestamp: {type: Date, default: Date.now},
})

MessageSchema.virtual("timestamp_format").get(function() {
    return DateTime.fromJSDate(this.timestamp).toFormat("M/d/yy h:mm a");
})

module.exports = mongoose.model("Message", MessageSchema);