const addBtn = document.querySelector("#add-button");
const toggleBtn = document.querySelector("#toggle-button");
const overlayEl = document.querySelector("#overlay");
const sidenavEl = document.querySelector("#sidenav");
const searchBtn = document.querySelector("#search-button");
const headerEl = document.querySelector("#header");
const headerBackBtn = document.querySelector("#header-back-button");

let isSearching = false;

const renderHeader = () => {
  headerEl.innerHTML = "";

  if (isSearching) {
    headerEl.innerHTML = `
      <div class="header-back">
        <button id="header-back-button"><i class="fa-solid fa-arrow-left"></i></button>
      </div>
      <div class="header-search">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" />
      </div>
      <div class="header-search-actions">
        <button><i class="fa-solid fa-ellipsis-vertical"></i></button>
      </div> 
    `;
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
        <button>SORT</button>
        <button><i class="fa-solid fa-ellipsis-vertical"></i></button>
      </div>    
    `;
  }
};

toggleBtn.addEventListener("click", () => {
  overlayEl.classList.add("show");
  sidenavEl.classList.add("show");
});

overlayEl.addEventListener("click", () => {
  overlayEl.classList.remove("show");
  sidenavEl.classList.remove("show");
});

searchBtn.addEventListener("click", () => {
  isSearching = true;
  renderHeader();
});

headerBackBtn.addEventListener("click", () => {
  isSearching = false;
  renderHeader();
});
