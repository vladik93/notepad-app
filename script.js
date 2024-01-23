const addBtn = document.querySelector("#add-button");

const headerEl = document.querySelector("#header");

const sidenavCategoryWrapperEl = document.querySelector('#sidenav-category-wrapper');
const sidenavAllNotesBtn = document.querySelector('#all-notes-button');

const headerPageTwoEl = document.querySelector("#header-page-two");
const notesWrapperEl = document.querySelector("#notes-wrapper");
const pageWrapperEl = document.querySelector("#page-wrapper");

const colorModalEl = document.querySelector("#color-modal");
const colorModalGridEl = document.querySelector("#color-modal-grid");
const colorModalConfirmBtn = document.querySelector("#color-modal-confirm");


const categoryModalEl = document.querySelector('#category-modal');
const categoryModalWrapperEl = document.querySelector('#category-modal-wrapper');
const categoryModalConfirmBtn = document.querySelector("#category-modal-confirm");

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
let isCategoriesEdit = true;

let timeoutId;
let isNoteHeld = false;

let isNoteSaved = false;

let colorArray = [
  "#ce8d8d", "#ceb38d", "#cec88d", "#b6ce8d", "#8dceb1", "#8daece", 
  "#908dce", "#c28dce",
];

// STORAGE

let NOTES = JSON.parse(localStorage.getItem("NOTES")) || [];
let CATEGORIES = JSON.parse(localStorage.getItem("CATEGORIES")) || [];

// FILTERED ARRAYS

let FILTERED_NOTES = [];





let PAGE_NUM = JSON.parse(sessionStorage.getItem("PAGE_NUM")) || 1;

console.log("PAGE_NUM", PAGE_NUM);

sessionStorage.removeItem("IS_NOTE_EDIT_MODE");

let IS_NOTE_EDIT_MODE = sessionStorage.getItem("IS_NOTE_EDIT_MODE") || false;



const addAlert = (text) => {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert");

  const alertTextEl = document.createElement("span");
  alertTextEl.innerText = text;
  alertEl.appendChild(alertTextEl);

  const alertIcon = document.createElement("i");
  alertIcon.classList.add("fa-solid", "fa-note-sticky");
  alertEl.insertAdjacentElement("afterbegin", alertIcon);

  document.body.insertAdjacentElement("beforeend", alertEl);

  setTimeout(() => {
    alertEl.remove();
  }, 2000);
};

const addCategory = (title) => {
  let newCategory = {
    id: new Date().getTime(),
    title,
    dateCreated: new Date().toJSON()
  }

  CATEGORIES.push(newCategory);
  localStorage.setItem("CATEGORIES", JSON.stringify(CATEGORIES));
}

// addCategory("Stuff");



//  HEADER FUNC

const renderHeader = (headerText = null, ...actionArgs) => {
  headerEl.innerHTML = "";
  
  if(headerText) {
    headerEl.innerHTML += `<div class="header-text">
      <h3>${headerText}</h3>
    </div>`
  }
 
  let actions = actionArgs[0];

  if(actions.isToggle) {
    headerEl.insertAdjacentHTML('afterbegin', 
      `<div class="header-toggler">
        <button id="toggle-button"><i class="fa-solid fa-bars"></i></button>
      </div>`);

    const toggleBtn = document.querySelector("#toggle-button");

    toggleBtn.addEventListener("click", () => {
      console.log('clicked');
      sidenavCategoryWrapperEl.innerHTML = `<span class="sidenav-title">Catergories</span>`;

      overlayEl.classList.add("show");
      sidenavEl.classList.add("show");

      CATEGORIES.map(category => {
        const noteCategoryBtn = document.createElement('button');
        noteCategoryBtn.classList.add('sidenav-action', 'note-category-button');
        noteCategoryBtn.setAttribute('id', category.id);
        noteCategoryBtn.innerHTML = `
            <i class="fa-solid fa-note-sticky"></i>
            <span>${category.title}</span>`;
        sidenavCategoryWrapperEl.insertAdjacentElement('beforeend', noteCategoryBtn);
        
       
        
        noteCategoryBtn.addEventListener('click', (e) => {
          let categoryId = parseInt(e.target.id);

          if(CATEGORIES.some(category => category.id === categoryId)) {
            renderNotes(NOTES, categoryId);
            overlayEl.classList.remove("show");
            sidenavEl.classList.remove("show");
          }    
          
        });
      });

      const editCategoriesBtn = document.createElement('button');
      editCategoriesBtn.classList.add('sidenav-action', 'note-category-button');
      editCategoriesBtn.innerHTML = `
        <i class="fa-solid fa-plus"></i>
        <span>Edit categories</span>`;
        
      sidenavCategoryWrapperEl.insertAdjacentElement('beforeend', editCategoriesBtn);

      editCategoriesBtn.addEventListener('click', () => {
        switchPage(3);
        
      })

    });
  } 

  if(actions.isSearch) {
    headerEl.innerHTML += `<button id="search-button">
      <i class="fa-solid fa-magnifying-glass"></i>
    </button>`
  }

}

renderHeader("Notepad Free", {isSearch: true, isToggle: true});


categoryModalConfirmBtn.addEventListener('click', () => {
  const selectedCategoryEls = document.querySelectorAll('.modal-category.selected');
  const selectedNoteEls = document.querySelectorAll('.note.selected');
  
  let selectedCategories = [];
  

  // if(selectedCategoryEls) {
    selectedCategoryEls.forEach(categoryEl => {
      let categoryId = parseInt(categoryEl.id);
      selectedCategories.push(categoryId);
      
      let selectedNotes = [];

      selectedNoteEls.forEach((selectedNoteEl) => {
        let selectedNoteId = parseInt(selectedNoteEl.id);
        
        selectedNotes.push(selectedNoteId);

        console.log(selectedNotes);
        let newNotesArray = NOTES.map(note => {
          if(selectedNotes.indexOf(note.id) > -1) {
            return {...note, categories: [...selectedCategories]}
          } else {
            return note;
          }
        });

        NOTES = newNotesArray;
        localStorage.setItem("NOTES", JSON.stringify(NOTES));
        overlayEl.classList.remove('show');
        categoryModalEl.classList.remove('show');

        IS_NOTE_EDIT_MODE = false;
        sessionStorage.removeItem('IS_NOTE_EDIT_MODE');
        addAlert("Categories updated");
      })     

      // renderHeader();
      renderNotes(NOTES);





    })
  // }



})

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

    
    renderNotes(NOTES);

    colorModalEl.classList.remove('show');
    overlayEl.classList.remove('show')
    

    IS_NOTE_EDIT_MODE = false;
    sessionStorage.removeItem('IS_NOTE_EDIT_MODE');

    // renderHeader();
  })



});



// renderHeader();


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

const switchPage = (pageNum) => {
  console.log("switchPage ->");
  if (pageNum === 1) {
    console.log("pageWrapperEl ", pageWrapperEl);
    pageWrapperEl.classList.remove("slide");
    sessionStorage.setItem("PAGE_NUM", 1);
  } else if (pageNum === 2) {
    pageWrapperEl.classList.add("slide");
    sessionStorage.setItem("PAGE_NUM", 2);
  } else if (pageNum === 3) {
   pageWrapperEl.classList.add("slide", "three");
   sessionStorage.setItem('PAGE_NUM', 3); 
  }
};

const updateNotePageColor = (currentNote) => {
        if(localStorage.getItem('CURRENT_NOTE')) {
          const pageTwoEl = document.querySelector('#page-two');
          const headerAddEditWrapperEl = document.querySelector('#header-add-edit-wrapper');
          const headerAddEditEl = document.querySelector('#header-add-edit');

          if(currentNote.color !== "#ffe5e5") {
            pageTwoEl.style.backgroundColor = currentNote.color;
            headerAddEditWrapperEl.style.backgroundColor = currentNote.color;
            headerAddEditEl.style.backdropFilter = "brightness(50%)";
          } else {
            pageTwoEl.style.background = "#ffe5e5";
            headerAddEditWrapperEl.style.background = "#756ab6";
            headerAddEditEl.style.backdropFilter = "none";
            
          }
        }
         

}

const renderPage = () => {
  const CURRENT_NOTE = JSON.parse(localStorage.getItem('CURRENT_NOTE'));
  console.log(CURRENT_NOTE);
  if (PAGE_NUM === 2) {
    pageWrapperEl.classList.add("slide");
    updateNotePageColor(CURRENT_NOTE);
  } else if (PAGE_NUM === 1) {
    pageWrapperEl.classList.remove("slide");
  } else if (PAGE_NUM === 3) {
    pageWrapperEl.classList.add('slide', 'three');
  }
};

const renderNotes = (notesArr, categoryId) => {
  notesWrapperEl.innerHTML = "";
  if (notesArr && notesArr.length) {
    notesArr.filter(x => x.categories.indexOf(categoryId) > -1 || categoryId === undefined).map((item) => {
      const noteEl = document.createElement("div");
      noteEl.classList.add("note");
      noteEl.setAttribute("id", item.id);
      noteEl.dataset.color = item.color;
      noteEl.style.backgroundImage = `linear-gradient(to top, ${item.color}, #fff2f2)`;

      noteEl.innerHTML = `
      <p class="note-title">${item.title}</p>
      <div class="note-content" id="note-content">
        <div class="note-category-wrapper" id="note-category-wrapper"></div>
        <p class="note-date">Last edit: ${new Date(
          item.lastEditDate
        ).toLocaleString()}</p>     
      </div>
      `;

      const noteContentEl = noteEl.querySelector('#note-content');
      const noteCategoryWrapperEl = noteEl.querySelector('#note-category-wrapper');
      
      if(item.categories.length) {
        let categoryCount = 0;
        item.categories.map(((category, index) => {
          if(index < 2) {
            const currentCategory = CATEGORIES.find(x => x.id === category);
            const { id, title, dateCreated } = currentCategory;
  
            const categoryEl = document.createElement('div');
            categoryEl.classList.add('note-category')
            // categoryEl.innerHTML = title + ",";
            index === item.categories.length - 1 ? categoryEl.innerHTML = title : categoryEl.innerHTML = title + ", ";

            noteCategoryWrapperEl.appendChild(categoryEl);
          } else {
            categoryCount++;
         
          }
        }))

        if(categoryCount > 0) {
          const categoryEl = document.createElement('div');
          categoryEl.classList.add('note-category');
          categoryEl.innerHTML = `(+${categoryCount})`;
          noteCategoryWrapperEl.insertAdjacentElement('beforeend', categoryEl);
        }


        
       

      }

      notesWrapperEl.appendChild(noteEl);

      noteEl.addEventListener("click", () => {
        if (IS_NOTE_EDIT_MODE) {
          noteEl.classList.toggle("selected");
          // renderHeader();
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

          updateNotePageColor(CURRENT_NOTE);
          


          switchPage(2);
        }
      });

      noteEl.addEventListener("pointerdown", () => {
        isNoteHeld = true;
        timeoutId = setTimeout(() => {
          IS_NOTE_EDIT_MODE = true;
          sessionStorage.setItem("IS_NOTE_EDIT_MODE", true);
          noteEl.classList.add("selected");

          // renderHeader();
        }, 500);
      });

      noteEl.addEventListener("pointerup", () => {
        isNoteHeld = false;
        clearTimeout(timeoutId);
      });
    });
  }
};

renderNotes(NOTES);

renderPage();

addBtn.addEventListener("click", () => {
  
  switchPage(2);
});

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
    renderNotes(NOTES);
  } else {
    let newNote = {
      id: new Date().getTime(),
      title: addEditInput.value ? addEditInput.value : "Untitled",
      text: addEditTextarea.value,
      categories: [],
      color: "#ffe5e5",
      lastEditDate: new Date().toJSON(),
      dateCreated: new Date().toJSON(),
    };

    NOTES.push(newNote);
    localStorage.setItem("NOTES", JSON.stringify(NOTES));
    renderNotes(NOTES);
  }

  addAlert("Saved");
  isNoteSaved = true;
};

addEditInput.addEventListener("input", (e) => {
  addEditInput.value = e.target.value;
});

addEditTextarea.addEventListener("input", (e) => {
  addEditTextarea.value = e.target.value;
  console.log(addEditTextarea.value);
});



