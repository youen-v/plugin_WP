document.addEventListener("DOMContentLoaded", () => {
  const getContain = document.querySelector("#itemsContain");
  const addItem = document.querySelector("#addBtn");

  addItem.addEventListener("click", (event) => {
    event.preventDefault();
    const visibleSelect = Array.from(
      document.querySelectorAll("fieldset select:not(#project)")
    ).find((select) => !select.classList.contains("display")).value;
    const equalsItem = Array.from(document.querySelectorAll("div.item")).map(
      (div) => div.id
    );
    const isEqual = () => {
      for (let equalItem in equalsItem) {
        if (equalsItem[equalItem] === visibleSelect) {
          return true;
        }
      }
      return false;
    };
    if (visibleSelect === "defaultValue") {
      alert("Vous n'avez pas sélèctionné de solution");
    } else {
      if (isEqual()) {
        alert("Cette solution est déjà dans votre panier !");
      } else {
        getContain.classList.remove("display");
        createItems(visibleSelect);
      }
    }
  });

  function createItems(itemValue) {
    const createItem = document.createElement("div");
    createItem.classList.add("item");
    createItem.setAttribute("id", itemValue);
    getContain.appendChild(createItem);

    const valProj = document.createElement("p");
    valProj.innerText = itemValue;
    createItem.appendChild(valProj);

    const delBtn = document.createElement("i");
    delBtn.classList.add("fas");
    delBtn.classList.add("fa-delete-left");
    delBtn.classList.add("fa-sm");
    delBtn.setAttribute("id", itemValue);
    createItem.appendChild(delBtn);
  }
});
