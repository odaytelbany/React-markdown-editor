import React from "react";
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
// import { data } from "./data"
import Split from "react-split"
import { nanoid } from "nanoid"
import "react-mde/lib/styles/css/react-mde-all.css";


export default function App() {
    const [notes, setNotes] = React.useState(() => JSON.parse(localStorage.getItem("notes")) || [])
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (() => localStorage.getItem("currentNoteId")) || ""
    )
    
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [...prevNotes, newNote])
        setCurrentNoteId(newNote.id)
    }


    function deleteNote(event, noteId) {
        event.stopPropagation()
        let newNotes = []
        notes.forEach(note => {
            if (noteId !== note.id){
                newNotes.push(note);
            }
            
        });
        setNotes(newNotes)

    }
    
    function updateNote(text) {
        let newNotes = []
        notes.forEach(note => {
            if (note.id === currentNoteId){
                newNotes.unshift({ ...note, body: text })
            }
            else {
                newNotes.push(note)
            }
            
        });
        setNotes(newNotes)
    }
    
    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }


    React.useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes));
    }, [notes])
    React.useEffect(() => {
        localStorage.setItem("currentNoteId", currentNoteId);
    }, [currentNoteId])
    


    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[25, 75]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}