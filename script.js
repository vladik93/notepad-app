const addBtn = document.querySelector("#add-button");
const headerEl = document.querySelector("#header");

const sortModalEl = document.querySelector("#sort-modal");
const sortCancelBtn = document.querySelector("#sort-cancel-button");

let isSearching = false;

const renderHeader = () => {
  headerEl.innerHTML = "";

  if (isSearching) {
    headerEl.innerHTML = `
      <div class="header-back">
        <button id="header-back-button"><i class="fa-solid fa-arrow-left"></i></button>
      </div>
      <div class="header-search" id="header-search">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" id="header-search-input"/>
      </div>
      <div class="header-search-actions">
        <button><i class="fa-solid fa-ellipsis-vertical"></i></button>
      </div> 
    `;

    const headerBackBtn = document.querySelector("#header-back-button");

    const headerSearchInp = document.querySelector("#header-search-input");

    headerSearchInp.focus();

    headerBackBtn.addEventListener("click", () => {
      isSearching = false;
      renderHeader();
    });

    headerSearchInp.addEventListener("input", (e) => {
      let inputValue = e.target.value;

      const searchIcon = document.querySelector(".fa-magnifying-glass");

      if (inputValue.length > 0) {
        searchIcon.style.display = "none";
        const headerSearchEl = document.querySelector("#header-search");
        // const resetSearchBtn = document.createElement("button");
        // resetSearchBtn.classList.add("reset-search-button");
        // resetSearchBtn.setAttribute("id", "reset-search-button");
        // resetSearchBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;

        // headerSearchEl.insertAdjacentElement("beforeend", resetSearchBtn);
      } else {
        searchIcon.style.display = "block";
        const resetSearchBtn = document.querySelector("#reset-search-button");
        resetSearchBtn.style.display = "none";
      }
    });
  } else {
    headerEl.innerHTML = `
      <div class="header-toggler">
        <button id="toggle-button"><i class="fa-solid fa-bars"></i></button>
      </div>
      <div class="header-text">
        <h3>Notepad Free</h3>
        <p class="header-category">Category</p>
      </div>
      <div class="header-actions">
        <button id="search-button">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>
        <button id="sort-button">SORT</button>
        
        <button id="actions-button"><i class="fa-solid fa-ellipsis-vertical"></i></button>
      </div>    
    `;

    const searchBtn = document.querySelector("#search-button");
    const sortBtn = document.querySelector("#sort-button");

    searchBtn.addEventListener("click", () => {
      isSearching = true;
      renderHeader();
    });

    sortBtn.addEventListener("click", () => {
      overlayEl.classList.add("show");
      sortModalEl.classList.add("show");
    });
  }
};

// renderHeader();

const toggleBtn = document.querySelector("#toggle-button");
const overlayEl = document.querySelector("#overlay");
const searchBtn = document.querySelector("#search-button");
const sidenavEl = document.querySelector("#sidenav");

const headerBackBtn = document.querySelector("#header-back-button");

toggleBtn.addEventListener("click", () => {
  overlayEl.classList.add("show");
  sidenavEl.classList.add("show");
});

overlayEl.addEventListener("click", () => {
  document.querySelectorAll(".show").forEach((item) => {
    item.classList.remove("show");
  });
});

sortCancelBtn.addEventListener("click", () => {
  overlayEl.classList.remove("show");
  sortModalEl.classList.remove("show");
});
