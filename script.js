const addBtn = document.querySelector("#add-button");

const headerEl = document.querySelector("#header");

const promptEl = document.getElementById("prompt");

const sidenavCategoryWrapperEl = document.querySelector('#sidenav-category-wrapper');
const sidenavAllNotesBtn = document.querySelector('#all-notes-button');
const sidenavDeleteNotesBtn = document.querySelector('#deleted-notes-button');
const sidenavDisplayToggleBtn = document.querySelector("#display-mode-button");
const sidenavAboutBtn = document.getElementById('about-button');


const headerPageTwoEl = document.querySelector("#header-page-two");
const notesWrapperEl = document.querySelector("#notes-wrapper");
const pageWrapperEl = document.querySelector("#page-wrapper");

const headerAddEditWrapperEl = document.querySelector('#header-add-edit-wrapper');
const headerAddEditEl = document.querySelector('#header-add-edit');

const pageTwoEl = document.querySelector('#page-two');

const colorModalEl = document.querySelector("#color-modal");
const colorModalGridEl = document.querySelector("#color-modal-grid");
const colorModalConfirmBtn = document.querySelector("#color-modal-confirm");

const categoryModalEl = document.querySelector('#category-modal');
const categoryModalWrapperEl = document.querySelector('#category-modal-wrapper');
const categoryModalConfirmBtn = document.querySelector("#category-modal-confirm");

let addEditIdInput = null;
let addEditInputValue = "";
let addEditTextareaValue = "";

const editCategoryModalEl = document.getElementById('edit-category-modal');

let editCategoryModalInputValue = "";

let categoryEditInputValue = "";

const saveBtn = document.querySelector("#save-button");
const undoBtn = document.querySelector("#undo-button");

const sortModalEl = document.querySelector("#sort-modal");
const sortCancelBtn = document.querySelector("#sort-cancel-button");
const sortConfirmBtn = document.querySelector('#sort-confirm-button');
const sortOptionEls = document.querySelectorAll('[name="sort-option"]');

let sortBy = undefined;

let SORT_BY = localStorage.getItem("SORT_BY") || null;

const aboutModalEl = document.getElementById('about-modal');


let isSearching = false;
let isCategoriesEdit = false;

let noteSnippets = [];
let snippetLength = 20;



let timeoutId;
let isNoteHeld = false;

let isNoteSaved = false;

let colorArray = [
  "#d28383", "#d2a483", "#d2cc83", "#83d290", "#83d2ce", "#8394d2",
  "#9883d2", "#c883d2", "#e4d9b4", "#b4b7e4", "#b4e2e4", "#dbe4b4",
  "#e0cca9", "#e0c1a9", "#caa9e0", "#8b89c8", "#92a2bf", "#92bfa8",
  "#bcd7c9", "#c6bcd7", "#784f7d", "#87455e", "#bf5f5f", "#b06936",
  "#d99463", "#e4be7c" 

];

localStorage.removeItem("CURRENT_PAGE");

// STORAGE

let NOTES = JSON.parse(localStorage.getItem("NOTES")) || [];

let CATEGORIES = JSON.parse(localStorage.getItem("CATEGORIES")) || [];

let CURRENT_PAGE = sessionStorage.getItem("CURRENT_PAGE") || null;

let CURRENT_CATEGORY = JSON.parse(sessionStorage.getItem("CURRENT_CATEGORY")) || null;

let DELETED_NOTES = JSON.parse(localStorage.getItem("DELETED_NOTES")) || [];

// FILTERED ARRAYS

let FILTERED_NOTES = [];

sessionStorage.removeItem("IS_NOTE_EDIT_MODE");

let IS_NOTE_EDIT_MODE = sessionStorage.getItem("IS_NOTE_EDIT_MODE") || false;

let DISPLAY_MODE = localStorage.getItem("DISPLAY_MODE") || null;


if(localStorage.getItem("DISPLAY_MODE") === null) {
  localStorage.setItem("DISPLAY_MODE", 'light');
  DISPLAY_MODE = "light";
}



const renderPage = () => {
  switch(CURRENT_PAGE) {
    case "category-edit" : renderCategoryPage();
    break;

    case "add-edit-note" : renderAddEditPage();
    break;

    case "deleted-notes" : renderDeletedNotes();
    break;

    default : {
      renderNotes(NOTES, CURRENT_CATEGORY);
      break;
    }
  }
  
}

const sortNotes = (sortBy, a, b) => {
  switch(sortBy) {
    case "dateDesc" : {
      return new Date(b.lastEditDate) - new Date(a.lastEditDate);
    }
    case "dateAsc" : {
      return new Date(a.lastEditDate) - new Date(b.lastEditDate);
    }
    case "titleDesc" : {
      return String(b.title).localeCompare(a.title);
    }

    case "titleAsc" : {
      return String(a.title).localeCompare(b.title);
    }

    case "createDateDesc" : {
      return new Date(b.dateCreated) - new Date(a.dateCreated);
    }

    case "createDateAsc" : {
      return new Date(a.dateCreated) - new Date(b.dateCreated);
    }

    case "byColor" : {
      return colorArray.indexOf(a.color) - colorArray.indexOf(b.color);
    }

    default : {
      return null;
    }

  }

}


const setNoteColor = (noteColor) => {
  if(noteColor === "#ece3e7") {
    switch(DISPLAY_MODE) {
      case "light" : {
        return "#ece3e7";
      }
      case "dark" : {
        return "#1b1c1e";
      }
    }
  } else {
    return noteColor;
  }
}

const checkDisplayMode = () => {
  if(DISPLAY_MODE === 'light') {
    document.documentElement.setAttribute('data-display-mode', 'light');
  } else {
    document.documentElement.setAttribute('data-display-mode', 'dark');
  }
}


const renderNotes = (notesArr, categoryId = null, sortBy = undefined, snippetsArr = []) => {
  notesWrapperEl.innerHTML = "";

  console.log(notesArr, categoryId);
  if (notesArr && notesArr.length) {
    notesArr.sort((a, b) => sortNotes(sortBy, a, b)).filter(x => x.categories.indexOf(categoryId) > -1 || categoryId === null).map((item) => {
      const noteEl = document.createElement("div");
      noteEl.classList.add("note");
      noteEl.setAttribute("id", item.id);
      noteEl.dataset.color = item.color;
      noteEl.style.backgroundColor = setNoteColor(item.color);

      let noteSnippet = snippetsArr.find(snippet => snippet.id === parseInt(noteEl.id)) || {};

      noteEl.innerHTML = `
      <p class="note-title">${item.title}</p>
      <div class="note-content" id="note-content">
      ${noteSnippet.id === item.id ? `<span class="note-snippet">...${noteSnippet.snippet}...</span>` : ""}
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
          console.log(category);
          if(index < 2) {
            const currentCategory = CATEGORIES.find(x =>  x.id === category);
            const { id, title, dateCreated } = currentCategory;
  
            const categoryEl = document.createElement('div');
            categoryEl.classList.add('note-category')
            categoryEl.innerHTML = title + ",";
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
          renderHeader();
        } else {
          CURRENT_PAGE = "add-edit-note";
          sessionStorage.setItem("CURRENT_PAGE", 'add-edit-note');
          
          let currentNote = NOTES.find(
            (note) => note.id === parseInt(noteEl.id)
          );

          sessionStorage.setItem("CURRENT_NOTE", JSON.stringify(currentNote));
          

          let CURRENT_NOTE =
            JSON.parse(sessionStorage.getItem("CURRENT_NOTE")) || {};


          addEditIdInput = CURRENT_NOTE.id;
          addEditInputValue = CURRENT_NOTE.title;
          addEditTextareaValue = CURRENT_NOTE.text;
          

          renderAddEditPage();

          updateNotePageColor(CURRENT_NOTE);

          renderHeader();
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
  CURRENT_CATEGORY = categoryId;;

  console.log(CURRENT_CATEGORY);
  sessionStorage.setItem('CURRENT_CATEGORY', JSON.stringify(CURRENT_CATEGORY));

};



const renderDeletedNotes = () => {
  pageWrapperEl.classList.remove('slide');
  CURRENT_PAGE = "deleted-notes";
  sessionStorage.setItem("CURRENT_PAGE", CURRENT_PAGE);
  
  renderHeader();
  
  notesWrapperEl.innerHTML = "";

  DELETED_NOTES.map((item) => {
    const removedNoteEl = document.createElement("div");
    removedNoteEl.classList.add("note");
    removedNoteEl.setAttribute("id", item.id);
    removedNoteEl.dataset.color = item.color;
    removedNoteEl.style.backgroundColor = setNoteColor(item.color);

    removedNoteEl.innerHTML = `
    <p class="note-title">${item.title}</p>
    <div class="note-content" id="note-content">
      <div class="note-category-wrapper" id="note-category-wrapper"></div>
      <p class="note-date">Last edit: ${new Date(
        item.lastEditDate
      ).toLocaleString()}</p>     
    </div>
    `;

    removedNoteEl.addEventListener('click', () => {
      overlayEl.classList.add('show');

      const promptEl = document.getElementById('prompt');
      promptEl.classList.add('show');

      promptEl.innerHTML = `
        <p>Select an action for the note:</p>
        <div class="deleted-action-wrapper">
          <div class="deleted-select-wrapper">
            <input type="radio" class="checkbox rounded" id="select-undelete" value="undelete" name="delete-note-action" checked />
            <label for="select-undelete">Recover</label>
          </div>
          <div class="deleted-select-wrapper">
            <input type="radio" class="checkbox rounded" id="select-delete" value="delete" name="delete-note-action" />
            <label for="select-delete">Delete</label>
          </div>
        </div>
        <div class="deleted-action-buttons">
          <button>CANCEL</button>
          <button id="deleted-action-confirm">OK</button>
        </div>`

     

      const deleteNoteActionEls = document.querySelectorAll('[name="delete-note-action"]');

      let selectedDeleteOption = deleteNoteActionEls[0].value;
      let selectedNoteId = parseInt(removedNoteEl.id);


      deleteNoteActionEls.forEach(deleteNoteActionEl => {
        deleteNoteActionEl.addEventListener('change', (e) => {
          selectedDeleteOption = e.target.value;
        });
      })

      const deletedActionConfirmBtn = document.getElementById('deleted-action-confirm');
      
      deletedActionConfirmBtn.addEventListener('click', () => {
        if(selectedDeleteOption === "undelete" && selectedNoteId) {
          let deletedNotes = [...DELETED_NOTES];

          let deletedNoteIndex = deletedNotes.findIndex(note => note.id === selectedNoteId);

          let deletedItem = deletedNotes.splice(deletedNoteIndex, 1);

          DELETED_NOTES = deletedNotes;
          localStorage.setItem("DELETED_NOTES", JSON.stringify(DELETED_NOTES));

          let notesArray = [...NOTES];

          let newNotesArray = [...notesArray, ...deletedItem];

          NOTES = newNotesArray;
          localStorage.setItem("NOTES", JSON.stringify(NOTES));

          renderDeletedNotes();
        
          promptEl.innerHTML = "";
          promptEl.classList.remove('show');
          overlayEl.classList.remove('show');
        } 
        else if(selectedDeleteOption === "delete" && selectedNoteId) {
          let deletedNotes = [...DELETED_NOTES];

          let newDeleteNotesArr = deletedNotes.filter((note) => note.id !== selectedNoteId);

          DELETED_NOTES = newDeleteNotesArr;
          localStorage.setItem("DELETED_NOTES", JSON.stringify(DELETED_NOTES));
          
          renderDeletedNotes();
          
          promptEl.innerHTML = "";
          promptEl.classList.remove('show');
          overlayEl.classList.remove('show');

        }
      });
    });
    notesWrapperEl.appendChild(removedNoteEl);
  })
}

const renderCategoryPage = () => {
  pageTwoEl.innerHTML = "";
  
  sessionStorage.setItem("CURRENT_PAGE", 'category-edit');
  CURRENT_PAGE = "category-edit";
  
  const editCategoriesWrapperEl = document.createElement('div');
  editCategoriesWrapperEl.classList.add('edit-categories-wrapper');

  editCategoriesWrapperEl.innerHTML += `
    <div class="category-input-wrapper">
      <input class="add-edit-input category-input" id="category-edit-input" type="text" placeholder="Enter title..." maxlength="15" />
      <button class="category-edit-button" id="category-edit-button">ADD</button>
    </div>`

  const categoryEditInputEl = editCategoriesWrapperEl.querySelector('#category-edit-input');

  const categoryEditBtn = editCategoriesWrapperEl.querySelector('#category-edit-button');
        
  categoryEditInputEl.addEventListener('input', (e) => {
    categoryEditInputValue = e.target.value;
  })

  categoryEditBtn.addEventListener('click', () => {
    if(categoryEditInputValue !== "") {
      let newCategory = {
        id: new Date().getTime(),
        title: categoryEditInputValue,
        dateCreated: new Date().toJSON()
      }

      CATEGORIES.push(newCategory);
      localStorage.setItem("CATEGORIES", JSON.stringify(CATEGORIES));
      categoryEditInputValue = "";

      renderCategoryPage();
    }
  })

  const categoryListWrapper = document.createElement('ul');
  categoryListWrapper.classList.add('category-list-wrapper');

  if(CATEGORIES && CATEGORIES.length > 0) {
    CATEGORIES.map(category => {
      // if(CATEGORIES) {
        const categoryItemEl = document.createElement('li');
        categoryItemEl.classList.add('category-item');
        categoryItemEl.dataset.categoryId = category.id;
        categoryItemEl.draggable = "true";
  
        let categoryId = parseInt(categoryItemEl.dataset.categoryId);
  
        categoryItemEl.innerHTML = `
          <div class="category-item-content">
            <i class="fa-solid fa-grip-vertical"></i>
              <span>${category.title}</span>
            </div>
          <div class="category-item-actions">
            <button id="category-item-edit"><i class="fa-solid fa-pen"></i></button>
            <button id="category-item-delete"><i class="fa-solid fa-trash"></i></button>
          </div>`
    
          categoryItemEl.addEventListener('dragstart', (event) => {
            
            
          })
          
         const categoryItemEditBtn = categoryItemEl.querySelector('#category-item-edit');
         const categoryItemDeleteBtn = categoryItemEl.querySelector("#category-item-delete");
        
        
         categoryItemEditBtn.addEventListener('click', () => {
          let category = CATEGORIES.find(category => category.id === categoryId);
  
          editCategoryModalEl.innerHTML = `
            <div class="edit-category-modal-input-wrapper">
              <input type="hidden" id="edit-category-modal-id-input" />
              <p class="edit-category-title">Edit category name</p>
              <input type="text" class="edit-category-modal-input" id="edit-category-modal-input" placeholder="New category name" />
              <span id="edit-category-modal-message" class="edit-category-modal-message"></span>
            </div>
            <div class="edit-category-actions">
              <button id="edit-category-cancel">CANCEL</button>
              <button id="edit-category-confirm">OK</button>
            </div>
          `
  
          const editCategoryModalIdInput = document.querySelector('#edit-category-modal-id-input');
          const editCategoryModalInput = document.querySelector('#edit-category-modal-input');
  
          editCategoryModalIdInput.value = category.id;
          editCategoryModalInput.value = category.title;
  
          editCategoryModalInputValue = editCategoryModalInput.value;
  
          editCategoryModalInput.addEventListener('input', (e) => {
            editCategoryModalInputValue = e.target.value;
          })
  
          const editCategoryConfirmBtn = editCategoryModalEl.querySelector('#edit-category-confirm');
          
          editCategoryConfirmBtn.addEventListener('click', () => {
            let foundCategory = CATEGORIES.find(category => category.title == editCategoryModalInputValue);
  
            if(foundCategory) {
              const editCategoryModalMessageEl = document.getElementById('edit-category-modal-message');
              editCategoryModalMessageEl.innerHTML = "Category with that name already exists.";
            } else {
              let newCategoryArr = CATEGORIES.map(value => {
                if(value.id === category.id) {
                  return {...value, title: editCategoryModalInputValue}
                } else {
                  return value;
                }
              });

              CATEGORIES = newCategoryArr;
              localStorage.setItem("CATEGORIES", JSON.stringify(newCategoryArr));

              editCategoryModalEl.classList.remove("show");
              overlayEl.classList.remove("show");

              renderCategoryPage();
            }
          })

          overlayEl.classList.add('show');
          editCategoryModalEl.classList.add('show');
        });

        categoryItemDeleteBtn.addEventListener('click', (e) => {
          let parentEl = e.target.parentElement;
          let categoryItemEl = parentEl.parentElement

          let categoryId = parseInt(categoryItemEl.dataset.categoryId);
          
          let newCategoryArr = CATEGORIES.filter(category => category.id !== categoryId);

          CATEGORIES = newCategoryArr;
          localStorage.setItem("CATEGORIES", JSON.stringify(newCategoryArr));

          renderCategoryPage();

        })

        editCategoriesWrapperEl.appendChild(categoryItemEl);
  
      // }
    })
  }
 
  renderHeader();

 
  pageTwoEl.appendChild(editCategoriesWrapperEl);

  pageWrapperEl.classList.add('slide');

}

const renderAddEditPage = () => {
  const CURRENT_NOTE = JSON.parse(sessionStorage.getItem("CURRENT_NOTE"));
  
  isSearching = false;

  pageWrapperEl.classList.add('slide');
  
  sessionStorage.setItem("CURRENT_PAGE", 'add-edit-note');
  CURRENT_PAGE = "add-edit-note";

  
  renderHeader();

  pageTwoEl.innerHTML = "";
  
  pageTwoEl.innerHTML = `
    <form class="add-edit-form">
      <input type="hidden" id="add-edit-id" />
      <input
        class="add-edit-input"
        id="add-edit-input"
        type="text"
        placeholder="Enter title..."
      />
      <textarea
        id="add-edit-textarea"
        class="add-edit-textarea"
        placeholder="Enter text..."
      ></textarea>
    </form>`

    const addEditIdInput = document.querySelector("#add-edit-id");
    const addEditInput = document.querySelector("#add-edit-input");
    const addEditTextarea = document.querySelector("#add-edit-textarea");


    if(CURRENT_NOTE !== null) {
      const headerFilterEl = document.querySelector('.header > .filter');
      // addEditIdInput = CURRENT_NOTE.id;
      addEditInput.value = CURRENT_NOTE.title;
      addEditTextarea.value = CURRENT_NOTE.text;
      headerEl.style.backgroundImage = "none";
      // headerEl.style.backgroundColor = CURRENT_NOTE.color;
      headerFilterEl.style.backgroundColor = CURRENT_NOTE.color !== "#ece3e7" ? setNoteColor(CURRENT_NOTE.color) : "none";
      pageTwoEl.style.backgroundColor = setNoteColor(CURRENT_NOTE.color);

      
      
      // headerEl.style.backdropFilter = "brightness(50%)";

    } else {
      pageTwoEl.style.backgroundColor = setNoteColor("#ece3e7");
    }
    

    addEditInput.addEventListener("input", (e) => {
      isNoteSaved = false;
      addEditInputValue = e.target.value;

    
      
    });
    
    addEditTextarea.addEventListener("input", (e) => {
      isNoteSaved = false;
      addEditTextareaValue = e.target.value;
    });
  
}

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

const addEditNote = () => {
  if (sessionStorage.getItem("CURRENT_NOTE") !== null) {
    const CURRENT_NOTE = JSON.parse(sessionStorage.getItem("CURRENT_NOTE"));

    const { title, text } = CURRENT_NOTE;

    let notesArray = [...NOTES];

    const noteIndex = notesArray.findIndex((val) => val.id === CURRENT_NOTE.id);

    notesArray.splice(noteIndex, 1, {
      ...CURRENT_NOTE,
      title: addEditInputValue ? addEditInputValue : "Untitled",
      text: addEditTextareaValue,
      lastEditDate: new Date().toJSON(),
    });

    localStorage.setItem("NOTES", JSON.stringify(notesArray));
    NOTES = notesArray;
    renderNotes(NOTES, CURRENT_CATEGORY);
  } else {
    let newNote = {
      id: new Date().getTime(),
      title: addEditInputValue ? addEditInputValue : "Untitled",
      text: addEditTextareaValue,
      categories: [],
      // color: "#ffe5e5",
      color: "#ece3e7",
      lastEditDate: new Date().toJSON(),
      dateCreated: new Date().toJSON(),
    };

    CURRENT_CATEGORY !== null ? newNote.categories.push(CURRENT_CATEGORY) : newNote.categories;

    NOTES.push(newNote);
    sessionStorage.setItem("CURRENT_NOTE", JSON.stringify(newNote));

    
    renderNotes(NOTES, CURRENT_CATEGORY);
   
  }

  localStorage.setItem("NOTES", JSON.stringify(NOTES));
  addAlert("Saved");
  isNoteSaved = true;
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
        <button class="reset-search-button" id="reset-search-button"><i class="fa-solid fa-xmark reset-search-icon"></i></button>
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

    resetSearchBtn.addEventListener('click', () => {
      headerSearchInp.value = "";
      resetSearchBtn.classList.remove('show');
      searchIcon.style.display = "block";
      headerSearchInp.focus();
    })

    headerSearchInp.addEventListener("input", (e) => {
      let inputValue = e.target.value;
    
      noteSnippets.length = 0;
    


      if (inputValue.length > 0) {
        searchIcon.style.display = "none";
        resetSearchBtn.classList.add('show');

        let newNotesArr = NOTES.filter(note => {
          if(String(note.text).toLowerCase().includes(inputValue.toLowerCase())) {
 
            let text = String(note.text).toLowerCase();
            let index = text.indexOf(inputValue.toLowerCase());
            console.log(index);
            
          
            let highlighted = '<mark>' + inputValue.toLowerCase() + '</mark>';
            let beforeSnippet = text.substring(index - 10, index);
            let afterSnippet = text.substring(index).replace(inputValue.toLowerCase(), "");

            let snippet = beforeSnippet + highlighted + afterSnippet;

            if(snippet.length > 0) {
              noteSnippets.push({id: note.id, snippet: snippet});
            }
            return note;
            
          } else if(String(note.title).toLowerCase().includes(inputValue.toLowerCase())) {
            return note;
          }
        })

        FILTERED_NOTES = newNotesArr;
        renderNotes(FILTERED_NOTES, null, undefined, noteSnippets);
    
      } else {
        searchIcon.style.display = "block";
        resetSearchBtn.classList.remove('show');
        renderNotes(NOTES);
      }
    });

    
  } 

  else if(CURRENT_PAGE === 'add-edit-note') {
    headerEl.classList.add("add-edit");

    headerEl.innerHTML = `
      <button id="header-back-button">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      
      <div class="header-text">
        <h3>Vladi's Notepad</h3>
      </div>
      <div class="header-actions">
        <button id="save-button">SAVE</button>
        <button id="undo-button">UNDO</button>
      </div>
      `

      const saveNoteBtn = document.getElementById('save-button');
      const headerBackBtn = document.getElementById('header-back-button');


      saveNoteBtn.addEventListener('click', () => {
        if (!isNoteSaved) {
          addEditNote();
          
        }
      })

      headerBackBtn.addEventListener("click", () => {
          if (!isNoteSaved) {
            addEditNote();

          
          } 

          addEditInputValue = "";
          addEditTextareaValue = "";

          if (sessionStorage.getItem("CURRENT_NOTE") !== null) {
            sessionStorage.removeItem("CURRENT_NOTE");
            updateNotePageColor();
          }

          if(sessionStorage.getItem("CURRENT_PAGE") !== null) {
            CURRENT_PAGE = null;
            sessionStorage.removeItem("CURRENT_PAGE");
          }

          isNoteSaved = false;
          pageWrapperEl.classList.remove('slide'); 
          pageTwoEl.style.backgroundColor = "none";
          
          renderHeader();
          renderNotes(NOTES, CURRENT_CATEGORY);
        });
  } 

  else if(CURRENT_PAGE === 'category-edit') {
    headerEl.innerHTML = `
    <div class="header-toggler">
      <button id="toggle-button"><i class="fa-solid fa-bars"></i></button>
    </div>
    <div class="header-text">
      <h3>Categories</h3>
    </div>
  `;
  }
  else if(CURRENT_PAGE === "deleted-notes") {
    headerEl.innerHTML = `
      <div class="header-toggler">
        <button id="toggle-button"><i class="fa-solid fa-bars"></i></button>
      </div>
      <div class="header-text">
        <h3>Trash</h3>
      </div>
      <div class="header-actions">
      <div class="hotfix-overlay" id="hotfix-overlay"></div>
      <div class="more-options-wrapper">

        <button id="more-options-button"><i class="fa-solid fa-ellipsis-vertical"></i></button>
        <div class="more-options" id="more-options">
          <div class="more-option" id="more-option-undelete-all">Undelete All</div>
          <div class="more-option" id="more-option-empty-trash">Empty Trash</div>
        </div>
      </div>`;   


    const actionsBtn = document.getElementById('more-options-button');
    const hotfixOverlayEl = document.getElementById('hotfix-overlay');

    hotfixOverlayEl.addEventListener("click", () => {
      document.querySelectorAll(".show").forEach((item) => {
        item.classList.remove("show");
      });
    });
  


    if(actionsBtn) {
      const moreOptionsEl = document.querySelector('.more-options');

      actionsBtn.addEventListener('click', () => {
        moreOptionsEl.classList.add('show');
        hotfixOverlayEl.classList.add('show');
        
 
      });

      const moreOptionUndeleteAllEl = document.getElementById('more-option-undelete-all');
      
      moreOptionUndeleteAllEl.addEventListener('click', () => {
        moreOptionsEl.classList.remove('show');
        overlayEl.classList.add('show');
        
        const promptEl = document.getElementById('prompt');
        promptEl.classList.add('show');

        promptEl.innerHTML = `
          <p>Restore all notes?</p>
            <div class="prompt-actions">
              <button>No</button>
              <button id="undelete-notes-button">Yes</button>
            </div>
        `

        const undeleteNotesBtn = document.getElementById('undelete-notes-button');

        if(undeleteNotesBtn) {
          undeleteNotesBtn.addEventListener('click', () => {
            let removedNotes = [];
            
            let notesArray = [...NOTES];

            DELETED_NOTES.forEach(note => {
              removedNotes.push(note);
            });

            NOTES = [...removedNotes, ...notesArray];
            localStorage.setItem("NOTES", JSON.stringify(NOTES));

            DELETED_NOTES = [];
            localStorage.removeItem("DELETED_NOTES");
            renderDeletedNotes();

            promptEl.innerHTML = "";
            promptEl.classList.remove('show');
            overlayEl.classList.remove('show');
          })
        }
      })

      const moreOptionEmptyTrash = document.getElementById('more-option-empty-trash');

      moreOptionEmptyTrash.addEventListener('click', () => {
        moreOptionsEl.classList.remove('show');
        overlayEl.classList.add('show');

        const promptEl = document.getElementById('prompt');
        promptEl.classList.add('show');

        promptEl.innerHTML = `
          <p>Are you sure that you want to delete all of the trashed notes?</p>
          <div class="prompt-actions">
            <button>No</button>
            <button id="confirm-empty-trash-button">Yes</button>
          </div>`
        
        const confirmEmptyTrashBtn = document.getElementById('confirm-empty-trash-button');
        
        confirmEmptyTrashBtn.addEventListener('click', () => {
          let deletedNotes = [...DELETED_NOTES];
          let deleteNotesLength = deletedNotes.length;

          deletedNotes.length = 0;

          DELETED_NOTES = deletedNotes;
          localStorage.setItem("DELETED_NOTES", JSON.stringify(DELETED_NOTES));
          
          renderDeletedNotes();
          
          promptEl.innerHTML = "";
          promptEl.classList.remove('show');
          overlayEl.classList.remove('show');
         
          addAlert(`Deleted Notes (${deleteNotesLength})`);
        });
      });
    }
  } 
   else {
    headerEl.classList.remove('add-edit');

    let current = CURRENT_CATEGORY !== null ? CATEGORIES.find(category => CURRENT_CATEGORY === category.id) : null;

    let title = current?.title || "";
    

    headerEl.innerHTML = `
      <div class="header-toggler">
        <button id="toggle-button"><i class="fa-solid fa-bars"></i></button>
      </div>
      <div class="header-text">
        <h3>Vladi's Notepad</h3>
        <p class="header-category">${title}</p>
      </div>
      <div class="header-actions">
        <button id="search-button">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>
        <button id="sort-button">SORT</button>
        <button id="all-selected"><i class="fa-solid fa-expand"></i></button>
      </div>    
    `;

    const searchBtn = document.querySelector("#search-button");
    const sortBtn = document.querySelector("#sort-button");   
    const allSelectedBtn = document.getElementById('all-selected');

    let selectedNoteEls = document.querySelectorAll(".note.selected");

    allSelectedBtn.addEventListener("click", () => {
      let noteEls = document.querySelectorAll(".note");

      noteEls.forEach((noteEl) => {
        if (!noteEl.classList.contains("selected")) {
          noteEl.classList.add("selected");
        }

        if (noteEls.length === selectedNoteEls.length) {
          noteEl.classList.remove("selected");
        }

        IS_NOTE_EDIT_MODE = true;

        sessionStorage.setItem("IS_NOTE_EDIT_MODE", true);
        
        renderHeader();
      });
    });
    
    searchBtn.addEventListener("click", () => {
      isSearching = true;
      renderHeader(headerEl);
    });

    sortBtn.addEventListener("click", () => {
      sortOptionEls.forEach(option => {
        if(option.value === SORT_BY) {
          option.checked = true;
        }
      });


      overlayEl.classList.add("show");
      sortModalEl.classList.add("show");

    });
  }

    const toggleBtn = document.querySelector("#toggle-button");

    // SIDENAV TOGGLE
  
    if(toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        sidenavAllNotesBtn.addEventListener('click', () => {
          sessionStorage.removeItem('CURRENT_PAGE');
          overlayEl.classList.remove("show")
          sidenavEl.classList.remove("show");
          pageWrapperEl.classList.remove('slide');

          renderNotes(NOTES);
          sessionStorage.removeItem("CURRENT_PAGE");
          CURRENT_PAGE = null;

          if(sessionStorage.getItem("CURRENT_PAGE") === null) {
          renderHeader();
          }
          CURRENT_CATEGORY = null;
          sessionStorage.setItem('CURRENT_CATEGORY', JSON.stringify(CURRENT_CATEGORY));
      });


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
              pageWrapperEl.classList.remove('slide');
              renderNotes(NOTES, categoryId);
              overlayEl.classList.remove("show");
              sidenavEl.classList.remove("show");

              sessionStorage.removeItem("CURRENT_PAGE");
              sessionStorage.setItem("CURRENT_CATEGORY", JSON.stringify(category.id));

              renderHeader();
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
        renderCategoryPage();
    
    
          sidenavEl.classList.remove("show");
          overlayEl.classList.remove('show');
          pageWrapperEl.classList.add('slide');
          
        })
    
      });

      sidenavDeleteNotesBtn.addEventListener('click', () => {
        renderDeletedNotes();

        sidenavEl.classList.remove('show');
        overlayEl.classList.remove('show');        
      })
    }

  if (IS_NOTE_EDIT_MODE) {
    let selectedNoteEls = document.querySelectorAll(".note.selected");
    let selectedNoteCount = selectedNoteEls.length;
    headerEl.innerHTML = `
      <div class="header-back">
        <button id="back-selected"><i class="fa-solid fa-arrow-left"></i></button>
      </div>
      <span id="note-counter" class="note-counter">${selectedNoteCount}</span>
      
      <div class="header-actions">
        <div class="hotfix-overlay" id="hotfix-overlay"></div>
        <button id="all-selected"><i class="fa-solid fa-expand"></i></button>
        <button id="delete-selected"><i class="fa-solid fa-trash"></i></button>
        <div class="more-options-wrapper">
          <button id="more-options-button"><i class="fa-solid fa-ellipsis-vertical"></i></button>
          <div class="more-options" id="more-options">
            <div class="more-option">Export notes to text files</div>
            <div class="more-option" id="more-option-categorize">Categorize</div>
            <div class="more-option" id="more-option-colorize">Colorize</div>
          </div>
        </div>`;

    const deleteSelectedBtn = document.querySelector("#delete-selected");
    const backSelectedBtn = document.querySelector("#back-selected");
    const noteCounterEl = document.querySelector("#note-counter");
    const allSelectedBtn = document.querySelector("#all-selected");
    const moreOptionsBtn = document.querySelector("#more-options-button");
    const moreOptionsEl = document.querySelector("#more-options");
    const hotfixOverlayEl = document.getElementById('hotfix-overlay');
    // document.querySelectorAll("body > div:not(.first)");
    const moreOptionColorize = document.querySelector("#more-option-colorize");

    const colorRemoveBtn = document.querySelector("#color-remove");
   
    const moreOptionCategorize = document.querySelector('#more-option-categorize');

    deleteSelectedBtn.addEventListener("click", () => {
      overlayEl.classList.add('show');
      promptEl.classList.add('show');

      promptEl.innerHTML = `
        <p>Delete the selected notes?</p>
        <div class="prompt-actions">
          <button>CANCEL</button>
          <button id="delete-note-button">OK</button>
        </div>
      `
      const deleteNoteBtn = document.getElementById('delete-note-button');

      deleteNoteBtn.addEventListener('click', () => {
        selectedNoteEls.forEach(noteEl => {
          let deletedNote = NOTES.find(note => note.id === parseInt(noteEl.id));
          
          DELETED_NOTES.push(deletedNote);

          localStorage.setItem("DELETED_NOTES", JSON.stringify(DELETED_NOTES));

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
          renderNotes(NOTES);

          promptEl.innerHTML = "";
          promptEl.classList.remove('show');
          overlayEl.classList.remove('show');

        })
      });
    });

    backSelectedBtn.addEventListener("click", () => {
      sessionStorage.removeItem("IS_NOTE_EDIT_MODE");
      IS_NOTE_EDIT_MODE = false;
      selectedNoteEls.forEach(noteEl => {
        noteEl.classList.remove('selected');
      })
      renderHeader();
      renderNotes(NOTES);
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

    hotfixOverlayEl.addEventListener("click", () => {
      document.querySelectorAll(".show").forEach((item) => {
        item.classList.remove("show");
      });
    });

    moreOptionsBtn.addEventListener("click", () => {
      const moreOptionsEl = document.querySelector("#more-options");
      

      console.log(hotfixOverlayEl);

      hotfixOverlayEl.classList.add('show');
      moreOptionsEl.classList.add("show");

    });

    moreOptionColorize.addEventListener("click", () => {
      const selectedNoteElsLength = document.querySelectorAll('.note.selected').length;
      moreOptionsEl.classList.remove("show");

      if(selectedNoteElsLength) {
        colorModalGridEl.innerHTML = "";
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

    moreOptionCategorize.addEventListener('click', () => {
      categoryModalWrapperEl.innerHTML = "";
      const selectedNoteElsLength = document.querySelectorAll('.note.selected').length;
      moreOptionsEl.classList.remove("show");
      

      if(selectedNoteElsLength) {
        overlayEl.classList.add('show');

        CATEGORIES.map(category => {
          const modalCategoryEl = document.createElement('div');
          modalCategoryEl.classList.add('modal-category');
          modalCategoryEl.setAttribute('id', category.id)
          modalCategoryEl.innerHTML = `
            <label>${category.title}</label>
            <input type="checkbox"  class="checkbox" name="note-category" value=${category.id}  />
          `
          let modalCategoryCheckbox = modalCategoryEl.querySelector('[name="note-category"]');
          modalCategoryCheckbox.checked = false;
          

          modalCategoryEl.addEventListener('change', (e) => {
            if(e.target.checked) {
              modalCategoryCheckbox.checked = true;
              modalCategoryEl.classList.add('selected');
            } else {
              modalCategoryCheckbox.checked = false;
              modalCategoryEl.classList.remove('selected');
            }
          }) 
          categoryModalWrapperEl.appendChild(modalCategoryEl);
        })
        categoryModalEl.classList.add("show");
        
      }
      
    })
  }

  
  const filterEl = document.createElement('div');
  filterEl.classList.add('filter');

  headerEl.insertAdjacentElement("afterbegin", filterEl);
};

categoryModalConfirmBtn.addEventListener('click', () => {
  const selectedCategoryEls = document.querySelectorAll('.modal-category.selected');
  const selectedNoteEls = document.querySelectorAll('.note.selected');
  
  let selectedCategories = [];
  


  selectedCategoryEls.forEach(categoryEl => {
    let categoryId = parseInt(categoryEl.id);
    selectedCategories.push(categoryId);
    
    let selectedNotes = [];

    selectedNoteEls.forEach((selectedNoteEl) => {
      let selectedNoteId = parseInt(selectedNoteEl.id);
      
      selectedNotes.push(selectedNoteId);

      (selectedNotes);
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

    renderHeader();
    renderNotes(NOTES, CURRENT_CATEGORY);
  })
})

colorModalConfirmBtn.addEventListener('click', (event) => {
  const modalColorActiveEl = document.querySelector('.modal-color.active');
  
  // const activeColorId = modalColorActiveEl ? modalColorActiveEl.id : "#ffe5e5";
  const activeColorId = modalColorActiveEl ? modalColorActiveEl.id : "#ece3e7";

  const selectedNoteEls = document.querySelectorAll('.note.selected');

  let selectedNotes = [];

  selectedNoteEls.forEach(selectedNote => {
    const selectedNoteId = parseInt(selectedNote.id);

    selectedNotes.push(selectedNoteId);

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

    renderHeader();
  })
});


const overlayEl = document.querySelector("#overlay");
const searchBtn = document.querySelector("#search-button");
const sidenavEl = document.querySelector("#sidenav");




const headerBackBtn = document.querySelector("#header-back-button");

overlayEl.addEventListener("click", () => {
  document.querySelectorAll(".show").forEach((item) => {
    item.classList.remove("show");
    item.classList.remove('transparent');
  });
});



sortCancelBtn.addEventListener("click", () => {
  overlayEl.classList.remove("show");
  sortModalEl.classList.remove("show");
});

const updateNotePageColor = (currentNote) => {
  const filterEl = document.querySelector('.filter');
   (filterEl);

  if(sessionStorage.getItem('CURRENT_NOTE')) {
    const pageTwoEl = document.querySelector('#page-two');
    filterEl.background.style.backgroundColor = currentNote.color;
    
    // const headerAddEditWrapperEl = document.querySelector('#header-add-edit-wrapper');
    // const headerAddEditEl = document.querySelector('#header-add-edit');

    if(currentNote.color !== "#ffe5e5") {  
      pageTwoEl.style.backgroundColor = currentNote.color;
      headerEl.style.backgroundColor = currentNote.color;
    } else {
      pageTwoEl.style.background = "#ffe5e5";
      headerEl.style.background = "#a68366";
    }
  } else {
    pageTwoEl.style.backgroundColor = setNoteColor("#ece3e7");
  }
}

sortOptionEls.forEach(optionEl => {
  optionEl.addEventListener('change', (e) => {
    sortBy = e.target.value;
  })
});

sortConfirmBtn.addEventListener('click', () => {
  if(sortBy) {
    renderNotes(NOTES, undefined, sortBy);
    sortModalEl.classList.remove("show");
    overlayEl.classList.remove('show');

    NOTES = NOTES;
    localStorage.setItem("NOTES", JSON.stringify(NOTES));
    
    localStorage.setItem("SORT_BY", sortBy)
    SORT_BY = sortBy;
  }
});


const addNote = (title) => {
  let newNote = {
    id: new Date().getTime(),
    title,
    text: "HELLO",
    categories: [],
    color: "#ffe5e5",
    lastEditDate: new Date().toJSON(),
    dateCreated: new Date().toJSON(),
  };

  NOTES.push(newNote);

  localStorage.setItem("NOTES", JSON.stringify(NOTES));
}

addBtn.addEventListener("click", () => {
  renderAddEditPage();
});

sidenavDisplayToggleBtn.addEventListener('click', () => {
  if(localStorage.getItem("DISPLAY_MODE") === 'light') {
    DISPLAY_MODE = 'dark';
    localStorage.setItem("DISPLAY_MODE", DISPLAY_MODE);

    document.documentElement.setAttribute("data-display-mode", 'dark');

    sidenavDisplayToggleBtn.innerHTML = `
    <i class="fa-solid fa-sun"></i>
    <span>Light Mode</span>`
  } else if(localStorage.getItem("DISPLAY_MODE") === 'dark') {
    DISPLAY_MODE = 'light';
    localStorage.setItem("DISPLAY_MODE", DISPLAY_MODE);
    
    document.documentElement.setAttribute("data-display-mode", DISPLAY_MODE);

    sidenavDisplayToggleBtn.innerHTML = `
    <i class="fa-solid fa-moon"></i>
    <span>Dark Mode</span>`
  }
    

  const noteEls = document.querySelectorAll('.note');

  noteEls.forEach(noteEl => {
    if(noteEl.getAttribute('data-color') === '#ece3e7'){
      noteEl.style.backgroundColor = setNoteColor(noteEl.dataset.color);
    }
  })

  overlayEl.classList.remove('show');
  sidenavEl.classList.remove("show");


})

sidenavAboutBtn.addEventListener('click', () => {
  aboutModalEl.classList.add('show');
  overlayEl.classList.add('show');

  sidenavEl.classList.remove('show');
})

checkDisplayMode();

renderHeader();
renderNotes(NOTES, CURRENT_CATEGORY)
renderPage();

