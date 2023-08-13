document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("a.nav-link");

    navLinks.forEach((link) => {
      if (link.getAttribute("href") === window.location.pathname) {
        link.classList.add("active");
      }
    });
});