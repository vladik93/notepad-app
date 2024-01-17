const addBtn = document.querySelector("#add-button");

const headerEl = document.querySelector("#header");
const headerPageTwoEl = document.querySelector("#header-page-two");
const notesWrapperEl = document.querySelector("#notes-wrapper");
const pageWrapperEl = document.querySelector("#page-wrapper");

const colorModalEl = document.querySelector("#color-modal");
const colorModalGridEl = document.querySelector("#color-modal-grid");
const colorModalConfirmBtn = document.querySelector("#color-modal-confirm");


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

let isNoteSaved = false;

let colorArray = [
  "#ce8d8d", "#ceb38d", "#cec88d", "#b6ce8d", "#8dceb1", "#8daece", 
  "#908dce", "#c28dce",
];

// STORAGE

let NOTES = JSON.parse(localStorage.getItem("NOTES")) || [];
let PAGE_NUM = JSON.parse(sessionStorage.getItem("PAGE_NUM")) || 1;

console.log("PAGE_NUM", PAGE_NUM);

sessionStorage.removeItem("IS_NOTE_EDIT_MODE");

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
        <button class="reset-search-button" id="reset-search-button"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="header-search-actions">
        <button><i class="fa-solid fa-ellipsis-vertical"></i></button>
      </div> 
    `;

    const headerBackBtn = document.querySelector("#header-back-button");
    const resetSearchBtn = document.querySelector('#reset-search-button');
    
    const searchIcon = document.querySelector(".fa-magnifying-glass");

    const headerSearchInp = document.querySelector("#header-search-input");

    headerSearchInp.focus();

    headerBackBtn.addEventListener("click", () => {
      isSearching = false;
      renderHeader(headerEl);
    });

    headerSearchInp.addEventListener("input", (e) => {
      let inputValue = e.target.value;

     
      

      if (inputValue.length > 0) {
        searchIcon.style.display = "none";
        resetSearchBtn.classList.add('show');

        console.log('TYPING')

        NOTES.filter(item => item.title.toUpperCase() === inputValue.toUpperCase()).map(note => {
          console.log(note);
        })


      } else {
        searchIcon.style.display = "block";
        resetSearchBtn.classList.remove('show')
      }
    });

    resetSearchBtn.addEventListener('click', () => {
      headerSearchInp.value = "";
      resetSearchBtn.classList.remove('show');
      searchIcon.style.display = "block";
    
    })

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
    let selectedNoteCount = selectedNoteEls.length;
    console.log("selected notes", selectedNoteEls);
    console.log("length ->", selectedNoteEls.length);
    headerEl.innerHTML = `
      <div class="header-back">
        <button id="back-selected"><i class="fa-solid fa-arrow-left"></i></button>
      </div>
      <span id="note-counter" class="note-counter">${selectedNoteCount}</span>
      
      <div class="header-actions">
        <button id="all-selected"><i class="fa-solid fa-expand"></i></button>
        <button id="delete-selected"><i class="fa-solid fa-trash"></i></button>
        <div class="more-options-wrapper">
          <button id="more-options-button"><i class="fa-solid fa-ellipsis-vertical"></i></button>
          <div class="more-options" id="more-options">
            <div class="more-option">Export notes to text files</div>
            <div class="more-option">Categorize</div>
            <div class="more-option" id="more-option-colorize">Colorize</div>
          </div>
        </div>`;

    const deleteSelectedBtn = document.querySelector("#delete-selected");
    const backSelectedBtn = document.querySelector("#back-selected");
    const noteCounterEl = document.querySelector("#note-counter");
    const allSelectedBtn = document.querySelector("#all-selected");
    const moreOptionsBtn = document.querySelector("#more-options-button");
    const moreOptionsEl = document.querySelector("#more-options");
    // document.querySelectorAll("body > div:not(.first)");
    const moreOptionColorize = document.querySelector("#more-option-colorize");

    const colorRemoveBtn = document.querySelector("#color-remove");
   

    deleteSelectedBtn.addEventListener("click", () => {
      const deleteConfirm = confirm("Delete selcted noted?");

      if (deleteConfirm) {
        let selectedNoteEls = document.querySelectorAll(".note.selected");
        selectedNoteEls.forEach((noteEl) => {
          let newNotesArray = NOTES.filter(
            (note) => note.id !== parseInt(noteEl.id)
          );

          noteEl.classList.remove("selected");

          NOTES = newNotesArray;
          localStorage.setItem("NOTES", JSON.stringify(NOTES));

          selectedNoteCount = 0;
          noteCounterEl.innerText = selectedNoteCount;

          sessionStorage.removeItem('IS_NOTE_EDIT_MODE');
          IS_NOTE_EDIT_MODE = false;

          renderHeader();
          renderNotes();
        });
      }
    });

    backSelectedBtn.addEventListener("click", () => {
      console.log("back button pressed");
      sessionStorage.removeItem("IS_NOTE_EDIT_MODE");
      IS_NOTE_EDIT_MODE = false;
      renderHeader();
      renderNotes();
    });

    allSelectedBtn.addEventListener("click", () => {
      let noteEls = document.querySelectorAll(".note");

      noteEls.forEach((noteEl) => {
        if (!noteEl.classList.contains("selected")) {
          noteEl.classList.add("selected");
        }

        if (noteEls.length === selectedNoteEls.length) {
          noteEl.classList.remove("selected");
        }

        renderHeader();
      });
    });

    moreOptionsBtn.addEventListener("click", () => {
      const moreOptionsEl = document.querySelector("#more-options");
      moreOptionsEl.classList.add("show");
    });

    moreOptionColorize.addEventListener("click", () => {
      const selectedNoteElsLength = document.querySelectorAll('.note.selected').length;
      moreOptionsEl.classList.remove("show");

      if(selectedNoteElsLength) {
       
        overlayEl.classList.add("show");
        
        const modalColorActiveEls = document.querySelectorAll('.modal-color.active');
        modalColorActiveEls.forEach(colorEl => colorEl.classList.remove('active'));
  
        
        const selectedNoteEl = document.querySelector('.note.selected');
  
  
        colorArray.map((color) => {
          const modalColorEl = document.createElement("div");
          modalColorEl.classList.add("modal-color");
          modalColorEl.setAttribute("id", color);
          modalColorEl.style = `background: ${color}`;
  
          if(selectedNoteEl.dataset.color === modalColorEl.id) {
            modalColorEl.classList.add('active');
          }
      
          colorModalGridEl.appendChild(modalColorEl);
  
          modalColorEl.addEventListener('click', (e) =>{
            const colorId = modalColorEl.id;
            const modalColorActiveEls = document.querySelectorAll('.modal-color.active');
            const modalColorTitleEl = document.querySelector("#color-modal-title");
  
            modalColorActiveEls.forEach(elm => {
              elm.classList.remove('active');
            });
  
            modalColorEl.classList.add('active');
            modalColorTitleEl.style.backgroundColor = colorId;
          })
  
        });
        colorModalEl.classList.add("show");
      }

      

      
    });

    colorRemoveBtn.addEventListener('click', () => {
      const modalColorActiveEl = document.querySelector('.modal-color.active');
      const modalColorTitleEl = document.querySelector("#color-modal-title");


      if(modalColorActiveEl) {
        modalColorActiveEl.classList.remove("active");
        modalColorTitleEl.style.backgroundColor = "";
      }
    })
  }
};

colorModalConfirmBtn.addEventListener('click', (event) => {
  const modalColorActiveEl = document.querySelector('.modal-color.active');
  
  const activeColorId = modalColorActiveEl ? modalColorActiveEl.id : "#ffe5e5";

  const selectedNoteEls = document.querySelectorAll('.note.selected');

  let selectedNotes = [];

  selectedNoteEls.forEach(selectedNote => {
    const selectedNoteId = parseInt(selectedNote.id);

    selectedNotes.push(selectedNoteId);

    console.log(selectedNotes);


    // typeof selectedNote.id -> string
    let newNotesArray = NOTES.map(note => {
      if(selectedNotes.indexOf(note.id) > -1) {
        return {...note, color: activeColorId}
      } else {
        return note;
      }
    });

    NOTES = newNotesArray;
    localStorage.setItem('NOTES', JSON.stringify(newNotesArray));

    
    renderNotes();

    colorModalEl.classList.remove('show');
    overlayEl.classList.remove('show')
    

    IS_NOTE_EDIT_MODE = false;
    sessionStorage.removeItem('IS_NOTE_EDIT_MODE');

    renderHeader();


  })



});


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
    console.log("pageWrapperEl ", pageWrapperEl);
    pageWrapperEl.classList.add("slide");
    PAGE_NUM = 2;
    sessionStorage.setItem("PAGE_NUM", 2);
  } else if (PAGE_NUM === 2) {
    pageWrapperEl.classList.remove("slide");
    PAGE_NUM = 1;
    sessionStorage.setItem("PAGE_NUM", 1);
  }
};

console.log("PAGE_NUM", PAGE_NUM);

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
      noteEl.dataset.color = item.color;
      noteEl.style.backgroundImage = `linear-gradient(to top, ${item.color}, #fff2f2)`;

      noteEl.innerHTML = `
      <p class="note-title">${item.title}</p>
      <p class="note-date">Last edit: ${new Date(
        item.lastEditDate
      ).toLocaleString()}</p>      
      `;

      notesWrapperEl.appendChild(noteEl);

      noteEl.addEventListener("click", () => {
        if (IS_NOTE_EDIT_MODE) {
          noteEl.classList.toggle("selected");
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
        }, 500);
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
      title: addEditInput.value ? addEditInput.value : "Untitled",
      text: addEditTextarea.value,
      lastEditDate: new Date().toJSON(),
    });

    localStorage.setItem("NOTES", JSON.stringify(notesArray));
    NOTES = notesArray;
    renderNotes();
  } else {
    let newNote = {
      id: new Date().getTime(),
      title: addEditInput.value ? addEditInput.value : "Untitled",
      text: addEditTextarea.value,
      color: "#ffe5e5",
      lastEditDate: new Date().toJSON(),
      dateCreated: new Date().toJSON(),
    };

    NOTES.push(newNote);
    localStorage.setItem("NOTES", JSON.stringify(NOTES));
    renderNotes();
  }

  addAlert("Saved", document.body);
  isNoteSaved = true;
};

addEditInput.addEventListener("input", (e) => {
  addEditInput.value = e.target.value;
});

addEditTextarea.addEventListener("input", (e) => {
  addEditTextarea.value = e.target.value;
  console.log(addEditTextarea.value);
});

header2backBtn.addEventListener("click", () => {
  if (!isNoteSaved) {
    addEditNote();

    addEditInput.value = "";
    addEditTextarea.value = "";

    if (localStorage.getItem("CURRENT_NOTE") !== null) {
      localStorage.removeItem("CURRENT_NOTE");
    }

    switchPage();
  } else {
    if (localStorage.getItem("CURRENT_NOTE") !== null) {
      localStorage.removeItem("CURRENT_NOTE");
    }

    switchPage();
  }
  isNoteSaved = false;
  addEditIdInput.value = null;
  addEditInput.value = "";
  addEditTextarea.value = "";
});

saveBtn.addEventListener("click", () => {
  if (!isNoteSaved) {
    console.log("!isNoteSaved");
    addEditNote();
  }
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
