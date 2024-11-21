document.addEventListener("DOMContentLoaded", () => {
  const getDelElem = document.querySelector("#itemsContain");
  getDelElem.addEventListener("click", (event) => {
    if (event.target.matches("i")) {
      event.target.parentElement.remove();
    }
  });
});
