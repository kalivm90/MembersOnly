const {DateTime} = require("luxon")

// const date = DateTime.now();
// const formattedDate = date.toFormat("M/d/yyyy h:mm a");

const date = new Date()

const formattedDate = DateTime.fromJSDate(date).toFormat("M/d/yy h:mm a");

console.log(formattedDate)