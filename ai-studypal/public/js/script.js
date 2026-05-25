
window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const spinner = document.getElementById("loading-spinner");

  if (form && spinner) {
    form.addEventListener("submit", () => {
      spinner.style.display = "block";
      setTimeout(() => {
        const responseSection = document.getElementById("response-section");
        if (responseSection) {
          responseSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    });
  }
});

window.addEventListener("load", () => {
  const responseSection = document.getElementById("response-section");
  if (responseSection) {
    setTimeout(() => {
      responseSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  }
});
