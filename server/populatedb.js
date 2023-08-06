console.log("Populates database with mock values");

require("dotenv").config();
// crypt
const bcrypt = require('bcryptjs');
const util = require("util")

const User = require("./models/user");
const Message = require("./models/message");

// DB
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = process.env.MONGODB_URI
main().catch((err) => console.log(err));

// crypt
const hashAsync = util.promisify(bcrypt.hash);

const messages = [];
const users = [];

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await CreateUsers();
    await CreateMessages();
    console.log("Closing mongoose");
    mongoose.connection.close();

    console.log("Debug: Finished!")
    // console.log(messages)
    // console.log(users);
}


async function CreateUsers() {
    await Promise.all([
        UserCreate("Test", "Testie", "test@gmail.com", "test90", "test90", admin=true),
        UserCreate("Bob", "Miller", "bob@gmail.com", "bob90", "bob90"),
        UserCreate("Jill", "Jane", "jill@gmail.com", "jill90", "jill90"),
    ])
}
async function CreateMessages() {
    await Promise.all([
        MessageCreate("To Jill", "Hi Jill, from test", users[0]),
        MessageCreate("I'm Tired", "I dont want to see these flirty messages anymore", users[1]),
        MessageCreate("Hello Test", "Dinnner at 9pm Friday?", users[2]),
    ])
} 


async function UserCreate(firstName, lastName, email, username, password, admin=false) {
    const hashedPassword = await hashAsync(password, 10);

    const newuser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username, 
        password: hashedPassword, 
        admin: admin,
    });

    await newuser.save();
    users.push(newuser);
    console.log(`Added User: ${newuser.firstName}`)
}

async function MessageCreate(title, message, author, timestamp=null) {
    const newmessage = new Message({
        title: title, 
        message: message, 
        author: author,
    });

    newmessage.timestamp = timestamp === null ? Date.now() : timestamp;

    await newmessage.save()
    messages.push(newmessage);
    console.log(`Added new message: ${newmessage.title}`);

}


