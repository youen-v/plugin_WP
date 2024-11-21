document.addEventListener("DOMContentLoaded", () => {
  const selectProject = document.querySelector("#project");
  const addButton = document.querySelector("#addBtn");
  selectProject.addEventListener("change", (event) => {
    const valChange = event.target.value;
    toggleDisplay(valChange);
  });
  function toggleDisplay(value) {
    if (selectProject.value === "defaultValue") {
      addButton.classList.add("display");
    } else {
      addButton.classList.remove("display");
    }
    const allSelect = document.querySelectorAll(
      "fieldset select:not(#project)"
    );
    allSelect.forEach((select) => {
      select.classList.add("display");
    });

    const getSelect = document.querySelector("#" + value);
    if (getSelect) {
      getSelect.classList.remove("display");
    }
  }
});
