import { animateBanner } from "./util/util.js";

const showFormPasswords = () => {
    // showing passwords
    const password = document.querySelector("#password");
    const confirmPassword = document.querySelector("#confirmPassword");
    const seePassword = document.querySelector("#seePassword");


    seePassword.addEventListener("change", (e) => {
        if (e.target.checked) {
            password.type = "text"
            confirmPassword.type = "text"
        } else {
            password.type = "password"
            confirmPassword.type = "password"
        }
    })
}

const adminOnSignUp = () => {
    const admin = document.querySelector("#admin")

    admin.addEventListener("click", (e) => {
        // saves the original action of the form before preventing default behavior 
        const form = document.querySelector("#myForm"); 
        const originalAction = form.getAttribute("action");

        e.preventDefault()

        const adminPassword = "#{adminPassword}"
        const secretWord = prompt("Please enter secret word for admin access");
        
        // if cancel is chosen do nothing
        if (secretWord === null) return;

        // setting admin to false
        document.querySelector("#adminInput").value = (secretWord === adminPassword) ? true : false; 
        
        // resending the form
        form.setAttribute("action", originalAction);   
        form.submit();
    })
}

const checkUsernameOnSignUp = () => {
    const username = document.querySelector("#username");
    const usernameFeedback = document.querySelector("#checkUsername");

    const styleUsernameFeedback = (message, success) => {
        usernameFeedback.textContent = message;
        usernameFeedback.classList.remove(success ? "text-danger" : "text-success");
        usernameFeedback.classList.add(success ? "text-success" : "text-danger");
    };

    username.addEventListener("input", async () => {
        const value = username.value;

        try {
            if (value === "") {
                styleUsernameFeedback("", true);
            } else if (value.length === 1) {
                styleUsernameFeedback("Must be longer than 1 char", false);
            } else {
                const response = await fetch("/auth/checkUsername", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ value }),
            });

                const data = await response.json();
                styleUsernameFeedback(data.available ? "Username is available." : "Username is not available.", data.available);
            }
        } catch (err) {
            console.error("Error checking username", err);
        }
    });
}

const handleRedirectError = () => {
    const url = new URLSearchParams(window.location.search)

    if (url.size > 0) {
        const param = url.get("error")
        const errorBanner = document.querySelector(".error-banner");
    
        const alert = document.createElement("div");
        alert.setAttribute("id", "redirectError")
        alert.classList += "alert alert-danger text-center"
    
        errorBanner.appendChild(alert)
    
        if (param === "login") {
            alert.innerHTML = "Incorrect username or password."
        } else if (param === "autologin") {
            alert.innerHTML = "Error on autologin after signup, please login."
        }
        animateBanner(alert, errorBanner);
    }
}

const handleProvidedError = () => {
    const providedError = document.querySelector("#providedError");
    if (providedError !== null) animateBanner(providedError);
}


export {
    showFormPasswords, 
    adminOnSignUp, 
    checkUsernameOnSignUp, 
    handleRedirectError, 
    handleProvidedError
};