// HEADER 
const headerEl = document.querySelector("#header");

// PAGES
const pageWrapperEl = document.querySelector("#page-wrapper");
const pageOneEl = document.querySelector('#page-one');
const pageTwoEl = document.querySelector('#page-two');

// SIDENAV
const sidenavCategoryWrapperEl = document.querySelector('#sidenav-category-wrapper');
const sidenavEl = document.querySelector("#sidenav");

// OVERLAY 
const overlayEl = document.querySelector("#overlay");


// FLAGS 
let IS_SEARCHING = false;

const FLAGS = {
  IS_SEARCHING: false

}

// LOCAL STORAGE
let NOTES = JSON.parse(localStorage.getItem("NOTES")) || [];
let CATEGORIES = JSON.parse(localStorage.getItem("CATEGORIES")) || [];


const renderHeader = () => {
  headerEl.innerHTML = "";

  if(FLAGS.IS_SEARCHING) {
    headerEl.classList.add('is-searching');
    headerEl.innerHTML = `
    <div class="header-back">
      <button id="back-button"><i class="fa-solid fa-arrow-left"></i></button>
    </div>
    <div class="header-search" id="header-search">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input type="text" id="header-search-input"/>
      <button class="reset-search-button" id="reset-search-button"><i class="fa-solid fa-xmark"></i></button>
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
      <button id="sort-button">SORT</button>
      
      <button id="actions-button"><i class="fa-solid fa-ellipsis-vertical"></i></button>
    </div>`;

    const toggleBtn = document.querySelector("#toggle-button");
    const searchBtn = document.querySelector("#search-button");

    // EVENT LISTENERS 

  // TOGGLE
  toggleBtn.addEventListener('click', () => {
    sidenavCategoryWrapperEl.innerHTML = `<span class="sidenav-title">Catergories</span>`;

    overlayEl.classList.add("show");
    sidenavEl.classList.add("show");
  });

  // SEARCH
  searchBtn.addEventListener("click", () => {
    FLAGS.IS_SEARCHING = true;
    
    renderHeader();
  });
  }

  






  // ELEMENTS 
 
  const backBtn = document.querySelector("#back-button");


  

  // BACK
  backBtn.addEventListener('click', () => {
    console.log("HELLO");
  })



}

renderHeader();