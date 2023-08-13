import { checkUsernameOnSignUp, adminOnSignUp, handleProvidedError } from "../app.js";

// admin
adminOnSignUp();
// checks to see if username is valid
checkUsernameOnSignUp();
handleProvidedError();