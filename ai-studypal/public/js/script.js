
  window.addEventListener("DOMContentLoaded", () => {
    const response = document.getElementById("response-section");

    if (response) {
      setTimeout(() => {
        response.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 300);
    }
    const profileImage = document.getElementById("profile-pic");
    if (profileImage) {
      profileImage.addEventListener("click", () => {
        alert("Coming soon!");
      });
    }
    const form = document.querySelector("form");
    const spinner = document.getElementById("loading-spinner");

    if (form && spinner) {
      form.addEventListener("submit", () => {
        spinner.style.display = "block";
      });
    }
  });

  window.addEventListener("DOMContentLoaded", () => {
  const responseSection = document.getElementById("response-section");
  if (responseSection) {
    responseSection.scrollIntoView({ behavior: "smooth", block: "end" });
  }
});
