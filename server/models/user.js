const mongoose = require("mongoose");

const Schema = mongoose.Schema

const UserSchema = new Schema({
    firstName: {type: String, required: true, maxLength: 50},
    lastName: {type: String, required: true, maxLength: 50},
    email: {type: String, required: true},
    username: {type: String, required: true, maxLength: 20},
    googleId: { type: String }, // Add the googleId field here
    password: {type: String, required: true},
    admin: {
        type: Boolean, 
        required: true,
        default: false,
    },
})

UserSchema.virtual("fullname").get(function (){
    return `${this.firstName} ${this.lastName}`;
})

UserSchema.virtual("url").get(function (){
    return `/profile/${this._id}`;
})

module.exports = mongoose.model("User", UserSchema);