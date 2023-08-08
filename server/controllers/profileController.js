const asyncHandler = require("express-async-handler")

// index
exports.index = asyncHandler(async (req, res, next) => {
    res.render("pages/profile/profile_view", {
        title: "User Profile",

    })
})

// detail
exports.detail = asyncHandler(async (req, res, next) => {
    res.send("TODO profile detail")
})

// update get
exports.update_get = asyncHandler(async (req, res, next) => {
    res.send("TODO update get");
})
// update post 
exports.update_post = asyncHandler(async (req, res, next) => {
    res.send("TODO update post");
})

// delete get 
exports.delete_get = asyncHandler( async(req, res, next) => {
    res.send("TODO delete get")
}) 
// delete post
exports.delete_post = asyncHandler(async (req, res, next) => {
    res.send("TOOD delete post");
})