document.addEventListener("DOMContentLoaded", () => {
  const showModal = document.querySelector("button[type=submit]");
  const getModal = document.querySelector("div#modalPdf");

  showModal.addEventListener("click", (event) => {
    event.preventDefault();
    if (document.querySelector("div.item")) {
      getModal.classList.remove("display");
    } else {
      alert("Panier vide");
    }
  });

  const closeModal = document.querySelector("div.crossBtn");
  closeModal.addEventListener("click", () => {
    getModal.classList.add("display");
  });
});
