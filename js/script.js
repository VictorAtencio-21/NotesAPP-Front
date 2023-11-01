// Endpoints calling the API
const API_URL = "https://localhost:7163/api";

// UI Elements id selectors
const saveBtn = document.getElementById("save-btn");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const visible = document.getElementById("isVisible");
const notesContainer = document.getElementById("notes-container");
const buttonsContainer = document.getElementById("buttons-container");
const idContainer = document.getElementById("id-container");
let deleteBtn = "";
let updateBtn = "";

// Function to Populate the form with the note data
const populateForm = (id) => {
  getNote(id).then((note) => {
    titleInput.value = note.title;
    contentInput.value = note.content;
    visible.checked = note.isVisible;

    idContainer.innerHTML = `<label class="form-label"><strong>Note ID: </strong>${note.id}</label>`;
  });
};

// Get all the notes
const getNotes = async () => {
  // Fetch API
  const response = await fetch(`${API_URL}/Notes`);

  // Return the response
  return response.json();
};

// Clear the form and get the notes

const clearAndGet = () => {
  // Clear the input fields
  titleInput.value = "";
  contentInput.value = "";
  visible.checked = false;

  // Get the notes
  getNotes().then((notes) => {
    // console.log(notes);
    renderNotes(notes);
  });
};

// Get a single note
const getNote = async (id) => {
  // Fetch API
  const response = await fetch(`${API_URL}/Notes/${id}`);

  // Return the response
  return response.json();
};

// Create a note
const createNote = async (title, content, isVisible) => {
  // // Fetch API
  const response = await fetch(`${API_URL}/Notes/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      content,
      isVisible,
    }),
  });

  // Return the response
  return response.json();
};

// Update a note
const updateNote = async (id, note) => {
    // Fetch API
    const response = await fetch(`${API_URL}/Notes/${id}`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
    });
    
    // Return the response
    return response.json();
};

// Delete a note
const deleteNote = async (id) => {
    // Fetch API
    const response = await fetch(`${API_URL}/Notes/${id}`, {
        method: "DELETE",
    });
    
    // Return the response
    return response.json();
};

// Render the notes
getNotes().then((notes) => {
  // console.log(notes);
  renderNotes(notes);
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based
  const year = date.getFullYear();

  // Pad the day and month with leading zeros if necessary
  const formattedDay = String(day).padStart(2, "0");
  const formattedMonth = String(month).padStart(2, "0");

  return `${formattedDay}/${formattedMonth}/${year}`;
};

// Function to render the notes

const renderNotes = (notes) => {
  let AllNotes = "";

  notes.forEach((note) => {
    if (!note.isVisible) return;

    const noteElement = `
        <div class="card mb-3">
            <div class="card-header" style="cursor: pointer;" data-id="${
              note.id
            }">${note.title}</div>
            <div class="card-body">
                <p class="card-text">${note.content}</p>
                <p class="card-text"><strong>Created at: </strong>${formatDate(
                  note.createdAt
                )}</p>
            </div>
        </div>
        `;

    AllNotes += noteElement;
  });

  notesContainer.innerHTML = AllNotes;

  // Adding event listeners to each note
  document.querySelectorAll(".card .card-header").forEach((card) => {
    card.addEventListener("click", (e) => {
      const Id = card.dataset.id;
      populateForm(Id);
      renderNewButtons();

      // Delete a note
      deleteBtn.addEventListener("click", async (e) => {
        console.log("Delete button clicked", Id);

        await deleteNote(Id);
        buttonsContainer.innerHTML = `<button class="btn btn-primary" id="save-btn">Add Note</button>`
        idContainer.innerHTML = "";
        clearAndGet();
      });

      // Update a note
      updateBtn.addEventListener("click", async (e) => {
        console.log("Update button clicked", Id);

        const title = titleInput.value;
        const content = contentInput.value;
        const isVisible = visible.checked;

        await updateNote(Id, { title, content, isVisible });
        buttonsContainer.innerHTML = `<button class="btn btn-primary" id="save-btn">Add Note</button>`
        idContainer.innerHTML = "";
        clearAndGet();
      });
    });
  });
};

// Function to render the delete button if a note is selected
const renderNewButtons = () => {
  if (idContainer.innerHTML !== "") {
    buttonsContainer.innerHTML = `
        <button id="update-note" class="btn btn-primary">Update</button>
        <button id="delete-note" class="btn btn-danger">Delete</button>
        `;

    updateBtn = document.getElementById("update-note");
    deleteBtn = document.getElementById("delete-note");
  }
};

// Event Listeners

// Save a note
saveBtn.addEventListener("click", async (e) => {
  // console.log("Save button clicked", e);
  e.preventDefault();

  const title = titleInput.value;
  const content = contentInput.value;
  const isVisible = visible.checked;

  await createNote(title, content, isVisible);
  clearAndGet();
});
