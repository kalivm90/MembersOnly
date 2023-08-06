import { showFormPasswords, adminOnSignUp, checkUsernameOnSignUp, handleProvidedError } from "../app.js";


// assigns admin privlages on signup
adminOnSignUp();
// checks to see if username is valid
checkUsernameOnSignUp();
// shows passwords
showFormPasswords();
handleProvidedError();
