const addBtn = document.querySelector("#add-button");
const headerEl = document.querySelector("#header");
const notesWrapperEl = document.querySelector("#notes-wrapper");
const pageWrapperEl = document.querySelector("#page-wrapper");

const sortModalEl = document.querySelector("#sort-modal");
const sortCancelBtn = document.querySelector("#sort-cancel-button");

let isSearching = false;

let pageNum = 1;

// STORAGE

const NOTES = JSON.parse(localStorage.getItem("NOTES")) || [];

const addNote = (title, text) => {
  let newNote = {
    id: new Date().getTime(),
    title,
    text,
    lastEditDate: new Date().toJSON(),
    dateCreated: new Date().toJSON(),
  };

  NOTES.push(newNote);
  localStorage.setItem("NOTES", JSON.stringify(NOTES));
};

// addNote("first note", "this is the first note");
// addNote("second note", "this is the second note");
// addNote("third note", "this is the third note");

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

    const toggleBtn = document.querySelector("#toggle-button");
    const searchBtn = document.querySelector("#search-button");
    const sortBtn = document.querySelector("#sort-button");

    toggleBtn.addEventListener("click", () => {
      console.log("toggleBTN ->");
      overlayEl.classList.add("show");
      sidenavEl.classList.add("show");
    });

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

renderHeader();

const overlayEl = document.querySelector("#overlay");
const searchBtn = document.querySelector("#search-button");
const sidenavEl = document.querySelector("#sidenav");

const headerBackBtn = document.querySelector("#header-back-button");

overlayEl.addEventListener("click", () => {
  document.querySelectorAll(".show").forEach((item) => {
    item.classList.remove("show");
  });
});

sortCancelBtn.addEventListener("click", () => {
  overlayEl.classList.remove("show");
  sortModalEl.classList.remove("show");
});

const renderNotes = () => {
  if (NOTES && NOTES.length) {
    NOTES.map((item) => {
      const noteEl = document.createElement("div");
      noteEl.classList.add("note");

      noteEl.innerHTML = `
      <p class="note-title">${item.title}</p>
      <p class="note-date">Last edit: ${new Date(
        item.lastEditDate
      ).toLocaleString()}</p>      
      `;

      notesWrapperEl.appendChild(noteEl);
    });
  }
};

renderNotes();

addBtn.addEventListener("click", () => {
  if (pageNum === 1) {
    pageWrapperEl.classList.add("slide");
    pageNum = 2;
  } else {
    pageWrapperEl.classList.remove("slide");
    pageNum = 1;
  }
});
