const PROXY_URL = 'https://api.allorigins.win/raw?url=';
const API_BASE_URL = 'https://crudcrud.com/api/c6662bac108a43f3bbff6ffc8f4b68a8';

document.addEventListener('DOMContentLoaded', getNotes);

let notes = [];

async function getNotes() {
    try {
        const response = await fetch(PROXY_URL + encodeURIComponent(API_BASE_URL));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        notes = JSON.parse(data);
        displayNotes(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
    }
}

async function addNote() {
    const title = document.getElementById('note-title').value;
    const description = document.getElementById('note-description').value;

    if (title && description) {
        const newNote = { title, description };

        try {
            const response = await fetch(PROXY_URL + encodeURIComponent(API_BASE_URL), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newNote)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.text();
            const addedNote = JSON.parse(data);
            notes.push(addedNote);
            displayNotes(notes);
            document.getElementById('note-title').value = '';
            document.getElementById('note-description').value = '';
        } catch (error) {
            console.error('Error adding note:', error);
        }
    } else {
        alert('Please fill in both fields');
    }
}

function displayNotes(filteredNotes) {
    const notesList = document.getElementById('notes-list');
    if (!notesList) {
        console.error('notes-list element not found');
        return;
    }

    notesList.innerHTML = '';
    const noteCount = document.getElementById('note-count');
    noteCount.innerText = `Total Notes: ${notes.length}`;

    filteredNotes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.innerHTML = `
            <h2>${note.title}</h2>
            <p>${note.description}</p>
            <button class="delete-btn" onclick="deleteNote('${note._id}')">Delete</button>
        `;
        notesList.appendChild(noteElement);
    });
}

async function deleteNote(id) {
    try {
        const response = await fetch(PROXY_URL + encodeURIComponent(API_BASE_URL + '/' + id), {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        notes = notes.filter(note => note._id !== id);
        displayNotes(notes);
    } catch (error) {
        console.error('Error deleting note:', error);
    }
}

function searchNotes() {
    const searchValue = document.getElementById('search').value.toLowerCase();
    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchValue) ||
        note.description.toLowerCase().includes(searchValue)
    );
    displayNotes(filteredNotes);
}
