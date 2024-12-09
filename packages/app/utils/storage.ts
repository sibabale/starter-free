import AsyncStorage from '@react-native-async-storage/async-storage'
import { Note } from 'app/types/note'

export const saveNote = async (note: Note) => {
  try {
    await AsyncStorage.setItem(`note_${note.id}`, JSON.stringify(note))
  } catch (error) {
    console.error('Error saving note', error)
  }
}

export const deleteNote = async (noteId: string) => {
  try {
    await AsyncStorage.removeItem(`note_${noteId}`)
  } catch (error) {
    console.error('Error deleting note', error)
  }
}

export const loadNotes = async (): Promise<Note[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys()

    const noteKeys = keys.filter((key) => key.startsWith('note_'))
    const noteItems = await AsyncStorage.multiGet(noteKeys)
    const notes = noteItems.map(([key, value]) => JSON.parse(value || '{}') as Note)

    return notes
  } catch (error) {
    console.error('Error loading notes', error)
    return []
  }
}

export const findAndUpdateNote = async (
  noteId: string,
  updatedData: Partial<Note>
): Promise<Note | null> => {
  try {
    const noteJson = await AsyncStorage.getItem(`note_${noteId}`)

    if (!noteJson) {
      return null
    }

    const existingNote: Note = JSON.parse(noteJson)
    const updatedNote: Note = { ...existingNote, ...updatedData }

    await AsyncStorage.setItem(`note_${noteId}`, JSON.stringify(updatedNote))

    return updatedNote
  } catch (error) {
    console.error('Error finding and updating note', error)
    return null
  }
}
