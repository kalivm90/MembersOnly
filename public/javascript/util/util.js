const animateBanner = (elem, parent=null) => {
    // fade in banner
    setTimeout(() => {
        elem.classList.add("fade-in");
    }, 100);

    // fade out 
    setTimeout(() => {
        elem.classList.add("fade-out");

        elem.addEventListener("transitionend", () => {
            if (parent !== null) {
                parent.removeChild(elem)
            } else {
                elem.remove();
            } 
        });
    }, 4000);
}

const changeWindowLocationOnPress = (elem, path, preventDefault=false) => {
    if (elem !== null) {
        elem.addEventListener("click", (e) => {
            if (preventDefault) {
                e.preventDefault();
            } 

            window.location.href = path
        })
    } 
}

export {
    animateBanner,
    changeWindowLocationOnPress
}