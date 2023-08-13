import { changeWindowLocationOnPress } from "../util/util.js"

const loginBtn = document.querySelector("#login")
const createMessage = document.querySelector("#createMessage")


changeWindowLocationOnPress(loginBtn, "/auth/login")
changeWindowLocationOnPress(createMessage, "/messages/createMessage")

