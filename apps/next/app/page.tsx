'use client'

import { v4 as uuidv4 } from 'uuid'
import { useToastController } from '@tamagui/toast'
import { Search, Plus, Trash2 } from '@tamagui/lucide-icons'
import { useRouter, useParams } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'
import { Text, XStack, YStack, Input, Button, ScrollView } from 'tamagui'

import { Note } from 'app/types/note'
import NoteItem from 'app/components/note-item'
import NoteInputForm from 'app/components/molecules/NoteInputForm'
import LoadingScreen from './loading'
import { HomeScreen } from 'app/features/home/screen'
import { saveNote, deleteNote, loadNotes } from 'app/utils/storage'

export default function NoteLayout() {
  const toast = useToastController()
  const params = useParams()
  const router = useRouter()

  const [notes, setNotes] = useState<Note[]>([])
  const noteInputFormRef = useRef<any>(null)

  const [selectedNoteId, setSelectedNoteId] = useState(params?.id)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNotes = async () => {
      const newNotes = await loadNotes()
      setNotes(newNotes)
    }
    fetchNotes()
  }, [])

  useEffect(() => {
    if (params?.id) {
      setSelectedNoteId(params?.id)
      setIsLoading(false)
    } else if (notes.length > 0) {
      setSelectedNoteId(notes[0].id) // Default to the first note
    }
    setIsLoading(false)
  }, [params, notes])

  useEffect(() => {
    // Prefetch notes page when no notes are available
    if (notes.length === 0) {
      router.prefetch('/notes')
    }
  }, [notes, router])

  const selectedNote = notes.find((note) => note.id === selectedNoteId) || null

  const handleDeleteNote = async () => {
    if (selectedNoteId) {
      try {
        const indexToDelete = notes.findIndex((note) => note.id === selectedNoteId)

        // Delete note
        await deleteNote(selectedNoteId)

        // Update state
        const updatedNotes = notes.filter((note) => note.id !== selectedNoteId)
        setNotes(updatedNotes)

        // Select the next note or clear selection
        if (updatedNotes.length > 0) {
          const nextIndex = indexToDelete === 0 ? 0 : indexToDelete - 1
          setSelectedNoteId(updatedNotes[nextIndex].id)
          router.push(`/notes/${updatedNotes[nextIndex].id}`)
        } else {
          setSelectedNoteId(null)
          router.push('/notes')
        }
        toast.show('Note deleted successfully!', {
          message: `The note has been removed.`,
        })
      } catch (error) {
        console.error('Error deleting note', error)
      }
    }
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
    saveNote(newNote)
    const newNotes = await loadNotes()
    setNotes(newNotes)
    router.push(`/notes/${newNote.id}`)
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <XStack flex={1} height="100vh" overflow="hidden">
      <YStack
        width={250}
        flexShrink={0}
        borderColor="lightgray"
        backgroundColor="white"
        borderRightWidth={1}
      >
        <XStack
          padding="$3"
          alignItems="center"
          borderWidth={1}
          justifyContent="space-between"
          backgroundColor="white"
          borderBottomColor="lightgray"
        >
          <Text fontSize="$4" fontWeight="bold" color="black">
            All Notes
          </Text>
          <Button unstyled onClick={handleCreateNote}>
            <Plus color="gray" />
          </Button>
        </XStack>
        <XStack paddingHorizontal="$3" backgroundColor="white" alignItems="center">
          <Search color="gray" />
          <Input
            color="black"
            fontSize="$3"
            width="100%"
            placeholder="Search"
            borderColor="transparent"
            borderRadius={0}
            borderWidth={0}
            paddingHorizontal="$2"
            paddingVertical="$2"
            backgroundColor="white"
          />
        </XStack>
        <YStack flex={1} borderWidth={1} borderTopColor="lightgray">
          <ScrollView showsVerticalScrollIndicator={false}>
            <YStack padding="$2">
              {notes.map((note) => (
                <NoteItem
                  active={selectedNote?.id === note.id}
                  key={note.id}
                  note={note}
                  onClick={() => {
                    router.push(`/notes/${note.id}`)
                  }}
                />
              ))}
            </YStack>
          </ScrollView>
        </YStack>
      </YStack>

      <YStack
        flex={1}
        backgroundColor="white"
        overflow="hidden"
        paddingTop={0}
        jc={notes.length > 0 ? 'flex-start' : 'center'}
      >
        {notes.length > 0 && (
          <YStack overflow="hidden">
            <XStack
              padding="$3"
              alignItems="center"
              borderWidth={1}
              justifyContent="space-between"
              backgroundColor="white"
              borderBottomColor="lightgray"
            >
              <Text fontSize="$4" fontWeight="bold" color="black">
                Nota
              </Text>
              <Trash2 color="red" onClick={handleDeleteNote} />
            </XStack>
          </YStack>
        )}

        <YStack overflow="hidden" padding="$4">
          {notes.length > 0 ? (
            <NoteInputForm
              ref={noteInputFormRef}
              onChange={handleNoteChange}
              currentNoteId={selectedNote?.id}
              initialTitle={selectedNote?.title || ''}
              initialContent={selectedNote?.content || ''}
            />
          ) : (
            <HomeScreen />
          )}
        </YStack>
      </YStack>
    </XStack>
  )
}
