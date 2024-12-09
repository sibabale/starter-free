import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import { useState, useEffect } from 'react'

import { Note } from 'app/types/note'
import { loadNotes, saveNote, deleteNote } from 'app/utils/storage'

export const useNoteManager = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('') // New state for search
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]) // Filtered notes based on search

  useEffect(() => {
    const fetchNotes = async () => {
      const loadedNotes = await loadNotes()
      setNotes(loadedNotes)
      setFilteredNotes(loadedNotes) // Initialize filteredNotes with all notes
      setSelectedNoteId(loadedNotes[0]?.id || null)
      setIsLoading(false)
    }
    fetchNotes()
  }, [])

  // Update filteredNotes whenever searchQuery or notes change
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredNotes(notes)
    } else {
      setFilteredNotes(
        notes.filter(
          (note) =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }
  }, [searchQuery, notes])

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
    setFilteredNotes(updatedNotes)
    handleNoteSelection(newNote.id)
    return newNote
  }

  const handleDeleteNote = async () => {
    if (selectedNoteId) {
      await deleteNote(selectedNoteId)
      const updatedNotes = notes.filter((note) => note.id !== selectedNoteId)
      setNotes(updatedNotes)
      setFilteredNotes(updatedNotes)
      setSelectedNoteId(updatedNotes[0]?.id || null)
    }
  }

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query)
  }

  const selectedNote = notes.find((note) => note.id === selectedNoteId) || null

  return {
    notes: filteredNotes, // Return filtered notes
    isLoading,
    searchQuery,
    selectedNote,
    selectedNoteId,
    handleNoteChange,
    handleCreateNote,
    handleDeleteNote,
    handleNoteSelection,
    handleSearchQueryChange, // Expose search query handler
  }
}
