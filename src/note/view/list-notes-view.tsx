import { useEffect, useState } from "react"
import { createNote, deleteNote, getNotes, updateNote } from "../action";
import { NoteType } from "../types";

export function ListNotesView() {

    const [notes, setNotes] = useState<NoteType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const [titleError, setTitleError] = useState('');
    const [contentError, setContentError] = useState('');
    const [selectedNote, setSelectedNote] = useState<NoteType>(null);

    const [isEdit, setIsEdit] = useState(false);

    const handleSaveNote = async () => {
        let hasError = false;
        
        if (!title) {
            setTitleError('Title is required');
            hasError = true;
        } else {
            setTitleError('');
        }

        if (!content) {
            setContentError('Content is required');
            hasError = true;
        } else {
            setContentError('');
        }

        if (!hasError) {
            if (isEdit) {
                const updatedNote = {
                    title,
                    content,
                    createdAt: selectedNote?.createdAt,
                    id: selectedNote?.id
                }
                updateNoteRequest(updatedNote);
            } else {
                const newNoteInput = { title, content, createdAt: new Date().toISOString() };
                createNoteRequest(newNoteInput);
            }
            handleCancel();
        }
    };

    const updateNoteRequest = async (note: NoteType) => {
        try {
            const updatedNote = await updateNote(note);
            setNotes((prevNotes) =>
                prevNotes.map((prevNote) => (prevNote?.id === note?.id ? updatedNote : prevNote))
            );
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to edit note';
            setError(errorMessage);
        }
    }

    const createNoteRequest = async (note: NoteType) => {
        try {
            const newNote = await createNote(note);
            setNotes([newNote, ...notes])
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create note';
            setError(errorMessage);
        }
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        if (titleError) setTitleError(''); // Hide error when typing
      };
    
      const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        if (contentError) setContentError(''); // Hide error when typing
      };

    const handleAddNote = () => {
        setIsEdit(false);
        setIsDialogOpen(true);
    };

    const handleCancel = () => {
        setTitleError('');
        setContentError('');
        setIsDialogOpen(false);
        setTitle('');
        setContent('');
    };

    const fetchNotes = async () => {
        try {
            const fetchedNotes = await getNotes();
            setNotes(fetchedNotes);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch notes';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleEditNote = (note: NoteType) => {
        setIsEdit(true);
        setIsDialogOpen(true);
        setTitle(note?.title);
        setContent(note?.content);
        setSelectedNote(note);
    }

    const handleDeleteNote = async (noteId: string) => {
        try {
            await deleteNote(noteId);
            setNotes((prevNotes) => prevNotes.filter((note) => note?.id !== noteId));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete note';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchNotes();
    }, []);

    if (loading) {
        return <p>Loading notes...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Notes List</h2>
            <button type="button" style={styles.addButton} onClick={handleAddNote}>
                Add Note
            </button>
            {notes.length === 0 ? (
                <p>No notes found.</p>
            ) : (
                <ul style={styles.noteList}>
                    {notes.map((note, index) => (
                        <li key={index} style={styles.noteItem}>
                            <h3 style={styles.noteTitle}>{note?.title ?? ""}</h3>
                            <p style={styles.noteContent}>{note?.content}</p>
                            <small style={styles.noteDate}>
                                {new Date(note?.createdAt).toLocaleString()}
                            </small>
                            <div style={styles.buttonContainer}>
                                <button type="button" style={styles.editButton} onClick={() => handleEditNote(note)}>Edit</button>
                                <button type="button" style={styles.deleteButton} onClick={() => handleDeleteNote(note?.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}


            {isDialogOpen && (
                <div style={styles.dialogOverlay}>
                    <div style={styles.dialogContent}>
                        <h3>Add a new note</h3>
                        <input
                            style={styles.input}
                            type="text"
                            placeholder="Note title"
                            value={title}
                            onChange={handleTitleChange}
                        />
                        {titleError && <p style={styles.errorMessage}>{titleError}</p> || <div style={styles.spacer}/>}
                        <textarea
                            style={styles.input}
                            placeholder="Note content"
                            value={content}
                            onChange={handleContentChange}
                        />
                        {contentError && <p style={styles.errorMessage}>{contentError}</p> || <div style={styles.spacer}/>}
                        <div style={styles.dialogButtonContainer}>
                            <button type="button" style={styles.dialogButton} onClick={handleSaveNote}>
                                Save Note
                            </button>
                            <button type="button" style={styles.dialogButtonSecondary} onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        width: '100%',
        margin: '20px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
    },
    heading: {
        textAlign: 'center',
        fontSize: '24px',
        marginBottom: '20px',
    },
    noteList: {
        listStyle: 'none',
        padding: 0,
    },
    noteItem: {
        padding: '15px',
        marginBottom: '10px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    noteTitle: {
        fontSize: '18px',
        marginBottom: '5px',
    },
    noteContent: {
        fontSize: '14px',
        marginBottom: '10px',
    },
    noteDate: {
        fontSize: '12px',
        color: '#777',
    },
    addButton: {
        display: 'block',
        margin: '10px auto',
        padding: '10px 15px',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    dialogOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialogContent: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        width: '400px',
        textAlign: 'center',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    dialogButton: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    dialogButtonSecondary: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#f00',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    dialogButtonContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
        justifyContent: 'end'
    },
    errorMessage: {
        color: 'red',
        fontSize: '12px',
        margin: '0 0 20px 0',
        height: '20px',
        textAlign: 'end',
    },
    spacer: {
        width: '100%',
        height: '20px'
    },
    buttonContainer: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'flex-start',
        marginTop: '10px',
    },
    editButton: {
        padding: '5px 10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    deleteButton: {
        padding: '5px 10px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};