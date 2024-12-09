import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import { useState, useEffect } from 'react'

import { Note } from 'app/types/note'
import { loadNotes, saveNote, deleteNote } from 'app/utils/storage'

export const useNoteManager = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)

  useEffect(() => {
    const fetchNotes = async () => {
      const loadedNotes = await loadNotes()
      setNotes(loadedNotes)
      setSelectedNoteId(loadedNotes[0]?.id || null)
      setIsLoading(false)
    }
    fetchNotes()
  }, [])

  const handleNoteSelection = (noteId: string) => {
    setSelectedNoteId(noteId)
  }

  const handleNoteChange = (updatedNote: Note) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    )
  }

  const handleCreateNote = async () => {
    const newNote: Note = {
      id: uuidv4(),
      title: '',
      content: '',
      createdAt: new Date(),
    }
    await saveNote(newNote)
    const updatedNotes = await loadNotes()
    setNotes(updatedNotes)
    handleNoteSelection(newNote.id)
    return newNote
  }

  const handleDeleteNote = async () => {
    if (selectedNoteId) {
      await deleteNote(selectedNoteId)
      const updatedNotes = notes.filter((note) => note.id !== selectedNoteId)
      setNotes(updatedNotes)
      setSelectedNoteId(updatedNotes[0]?.id || null)
    }
  }

  const selectedNote = notes.find((note) => note.id === selectedNoteId) || null

  return {
    notes,
    isLoading,
    selectedNote,
    selectedNoteId,
    handleNoteChange,
    handleCreateNote,
    handleDeleteNote,
    handleNoteSelection,
  }
}
