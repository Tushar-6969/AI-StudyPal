
window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const spinner = document.getElementById("loading-spinner");
  const pdfInput = document.getElementById("pdfInput");
  const imageInput = document.getElementById("imageInput");
  const pdfName = document.getElementById("pdfName");
  const imageName = document.getElementById("imageName");

  // Display PDF file name
  if (pdfInput) {
    pdfInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        pdfName.textContent = "✓ " + e.target.files[0].name;
        pdfName.classList.add("text-success");
      } else {
        pdfName.textContent = "";
        pdfName.classList.remove("text-success");
      }
    });
  }

  // Display Image file name
  if (imageInput) {
    imageInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        imageName.textContent = "✓ " + e.target.files[0].name;
        imageName.classList.add("text-success");
      } else {
        imageName.textContent = "";
        imageName.classList.remove("text-success");
      }
    });
  }

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
