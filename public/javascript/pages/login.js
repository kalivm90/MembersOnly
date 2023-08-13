import { handleRedirectError, showFormPasswords, } from "../app.js";
import { changeWindowLocationOnPress } from "../util/util.js";


showFormPasswords();
handleRedirectError();

const googleAuth = document.querySelector("#googleAuth");
changeWindowLocationOnPress(googleAuth, "/auth/google", true);
