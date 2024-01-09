const addBtn = document.querySelector("#add-button");

const headerEl = document.querySelector("#header");
const headerPageTwoEl = document.querySelector("#header-page-two");
const notesWrapperEl = document.querySelector("#notes-wrapper");
const pageWrapperEl = document.querySelector("#page-wrapper");

const header2backBtn = document.querySelector("#header2-back-button");

const addEditIdInput = document.querySelector("#add-edit-id");
const addEditInput = document.querySelector("#add-edit-input");
const addEditTextarea = document.querySelector("#add-edit-textarea");

let addEditInputValue = "";
let addEditTextareaValue = "";

const saveBtn = document.querySelector("#save-button");
const undoBtn = document.querySelector("#undo-button");

const sortModalEl = document.querySelector("#sort-modal");
const sortCancelBtn = document.querySelector("#sort-cancel-button");

let isSearching = false;

let timeoutId;
let isNoteHeld = false;

// STORAGE

let NOTES = JSON.parse(localStorage.getItem("NOTES")) || [];
let PAGE_NUM =
  JSON.parse(sessionStorage.getItem("PAGE_NUM")) ||
  sessionStorage.setItem("PAGE_NUM", 1);

let IS_NOTE_EDIT_MODE = sessionStorage.getItem("IS_NOTE_EDIT_MODE") || false;

const addAlert = (text, containerEl) => {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert");

  const alertTextEl = document.createElement("span");
  alertTextEl.innerText = text;
  alertEl.appendChild(alertTextEl);

  const alertIcon = document.createElement("i");
  alertIcon.classList.add("fa-solid", "fa-note-sticky");
  alertEl.insertAdjacentElement("afterbegin", alertIcon);

  containerEl.insertAdjacentElement("beforeend", alertEl);

  setTimeout(() => {
    alertEl.remove();
  }, 2000);
};

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
      renderHeader(headerEl);
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
      renderHeader(headerEl);
    });

    sortBtn.addEventListener("click", () => {
      overlayEl.classList.add("show");
      sortModalEl.classList.add("show");
    });
  }

  if (IS_NOTE_EDIT_MODE) {
    let selectedNoteEls = document.querySelectorAll(".note.selected");
    console.log("length ->", selectedNoteEls.length);
    headerEl.innerHTML = selectedNoteEls.length;
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

const switchPage = () => {
  console.log("switchPage ->");
  if (PAGE_NUM === 1) {
    pageWrapperEl.classList.add("slide");
    PAGE_NUM = 2;
    sessionStorage.setItem("PAGE_NUM", 2);
  } else if (PAGE_NUM === 2) {
    pageWrapperEl.classList.remove("slide");
    PAGE_NUM = 1;
    sessionStorage.setItem("PAGE_NUM", 1);
  }
};

const renderPage = () => {
  if (PAGE_NUM === 2) {
    pageWrapperEl.classList.add("slide");
  } else if (PAGE_NUM === 1) {
    pageWrapperEl.classList.remove("slide");
  }
};

const renderNotes = () => {
  notesWrapperEl.innerHTML = "";
  if (NOTES && NOTES.length) {
    NOTES.map((item) => {
      const noteEl = document.createElement("div");
      noteEl.classList.add("note");
      noteEl.setAttribute("id", item.id);

      noteEl.innerHTML = `
      <p class="note-title">${item.title}</p>
      <p class="note-date">Last edit: ${new Date(
        item.lastEditDate
      ).toLocaleString()}</p>      
      `;

      notesWrapperEl.appendChild(noteEl);

      noteEl.addEventListener("click", () => {
        if (IS_NOTE_EDIT_MODE) {
          noteEl.classList.add("selected");
          renderHeader();
        } else {
          let currentNote = NOTES.find(
            (note) => note.id === parseInt(noteEl.id)
          );

          localStorage.setItem("CURRENT_NOTE", JSON.stringify(currentNote));

          const CURRENT_NOTE =
            JSON.parse(localStorage.getItem("CURRENT_NOTE")) || {};

          addEditIdInput.value = CURRENT_NOTE.id;
          addEditInput.value = CURRENT_NOTE.title;
          addEditTextarea.value = CURRENT_NOTE.text;

          switchPage();
        }
      });

      noteEl.addEventListener("pointerdown", () => {
        isNoteHeld = true;
        timeoutId = setTimeout(() => {
          IS_NOTE_EDIT_MODE = true;
          sessionStorage.setItem("IS_NOTE_EDIT_MODE", true);
          noteEl.classList.add("selected");

          renderHeader();
        }, 2000);
      });

      noteEl.addEventListener("pointerup", () => {
        isNoteHeld = false;
        clearTimeout(timeoutId);
      });
    });
  }
};

renderNotes();

renderPage();

addBtn.addEventListener("click", switchPage);

// PAGE 2

if (localStorage.getItem("CURRENT_NOTE") !== null) {
  const CURRENT_NOTE = JSON.parse(localStorage.getItem("CURRENT_NOTE")) || {};

  addEditIdInput.value = CURRENT_NOTE.id;
  addEditInput.value = CURRENT_NOTE.title;
  addEditTextarea.value = CURRENT_NOTE.text;
}

const addEditNote = () => {
  if (localStorage.getItem("CURRENT_NOTE") !== null) {
    const CURRENT_NOTE = JSON.parse(localStorage.getItem("CURRENT_NOTE"));

    const { title, text } = CURRENT_NOTE;

    let notesArray = [...NOTES];

    const noteIndex = notesArray.findIndex((val) => val.id === CURRENT_NOTE.id);

    notesArray.splice(noteIndex, 1, {
      ...CURRENT_NOTE,
      title: addEditInput.value,
      text: addEditTextarea.value,
      lastEditDate: new Date().toJSON(),
    });

    localStorage.setItem("NOTES", JSON.stringify(notesArray));
    NOTES = notesArray;
    renderNotes();
  } else {
    let newNote = {
      id: new Date().getTime(),
      title: addEditInput.value,
      text: addEditTextarea.value,
      lastEditDate: new Date().toJSON(),
      dateCreated: new Date().toJSON(),
    };

    NOTES.push(newNote);
    localStorage.setItem("NOTES", JSON.stringify(NOTES));
    renderNotes();
    addAlert("Saved", document.body);
  }
};

addEditInput.addEventListener("input", (e) => {
  addEditInput.value = e.target.value;
});

addEditTextarea.addEventListener("input", (e) => {
  addEditTextarea.value = e.target.value;
  console.log(addEditTextarea.value);
});

header2backBtn.addEventListener("click", () => {
  if (addEditInput.value || addEditTextarea.value) {
    addEditNote();
  } else {
    addEditInput.value = "Untitled";
    addEditNote();
  }

  addEditInput.value = "";
  addEditTextarea.value = "";

  if (localStorage.getItem("CURRENT_NOTE") !== null) {
    localStorage.removeItem("CURRENT_NOTE");
  }

  switchPage();
});

saveBtn.addEventListener("click", () => {
  addEditNote();
});

// let isMouseHold = false;

// pageWrapperEl.addEventListener("pointerdown", () => {
//   isMouseHold = true;
//   setTimeout(() => {
//     if (isMouseHold) {
//       console.log("is held!");
//     }
//   }, 3000);
// });

// pageWrapperEl.addEventListener("pointerup", () => {
//   isMouseHold = false;
// });
