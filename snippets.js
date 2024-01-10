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
