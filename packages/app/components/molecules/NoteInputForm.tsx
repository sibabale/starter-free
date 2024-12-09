'use client'

import { Note } from 'app/types/note'
import { Keyboard } from 'react-native'
import { v4 as uuidv4 } from 'uuid'
import { TextArea, YStack } from 'tamagui'
import { loadNotes, findAndUpdateNote } from 'app/utils/storage'
import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react'

interface NoteInputFormProps {
  onChange: (note: Note) => void
  initialTitle?: string
  currentNoteId?: string
  initialContent?: string
  maxTitleChars?: number
}

const NoteInputForm = forwardRef(
  (
    {
      onChange,
      initialTitle = '',
      initialContent = '',
      currentNoteId = '',
      maxTitleChars = 100,
    }: NoteInputFormProps,
    ref
  ) => {
    const [title, setTitle] = useState<string>(initialTitle)
    const [content, setContent] = useState<String>(initialContent)
    const [currentNote, setCurrentNote] = useState<Note | null>(null)

    const titleRef = useRef<HTMLTextAreaElement | null>(null)
    const contentRef = useRef<HTMLTextAreaElement | null>(null)

    // Expose saveCurrentNoteNow method to the parent
    useImperativeHandle(ref, () => ({
      saveCurrentNoteNow,
    }))

    useEffect(() => {
      const trimmedTitle = title.trim()
      const trimmedContent = content.trim()

      const updatedNote: Note = {
        id: currentNoteId || uuidv4(),
        title: trimmedTitle,
        content: trimmedContent,
        updatedAt: new Date(),
      }

      findAndUpdateNote(updatedNote.id, updatedNote)
      onChange(updatedNote)
    }, [title, content])

    const handleTitleChange = (text: string) => {
      if (text.length <= maxTitleChars) {
        setTitle(text)
      }
    }

    const saveCurrentNoteNow = () => {
      const trimmedTitle = title.trim()
      const trimmedContent = content.trim()
      const noteToSave: Note = {
        id: currentNoteId || uuidv4(),
        title: trimmedTitle,
        content: trimmedContent,
        updatedAt: new Date(),
      }

      onChange(noteToSave)
    }
    useEffect(() => {
      const fetchNotes = async () => {
        const notes = await loadNotes()
        const fetchedNote = notes.find((note) => note.id === currentNoteId)
        if (fetchedNote) {
          setCurrentNote(fetchedNote)
        } else {
          setCurrentNote(null)
        }
      }
      fetchNotes()
    }, [currentNoteId])

    useEffect(() => {
      if (currentNote?.title && currentNote?.content) {
        setTitle(currentNote.title)
        setContent(currentNote.content)
      } else {
        setTitle('')
        setContent('')
      }
    }, [currentNote])

    useEffect(() => {
      const timer = setTimeout(() => {
        const trimmedTitle = title.trim()
        const trimmedContent = content.trim()

        if (
          currentNote?.id &&
          (currentNote?.title !== trimmedTitle || currentNote?.content !== trimmedContent)
        ) {
          const updatedNote: Note = {
            ...currentNote,
            title: trimmedTitle,
            content: trimmedContent,
            updatedAt: new Date(),
          }
          findAndUpdateNote(currentNote?.id, updatedNote)
        }
      }, 500)

      return () => clearTimeout(timer)
    }, [title, content, onChange])

    const handleTitleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        contentRef.current?.focus()
      }
    }

    const handleContentKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Backspace' && content === '') {
        e.preventDefault()
        Keyboard.dismiss()
        titleRef.current?.focus()
      }
    }

    return (
      <YStack>
        <TextArea
          ref={titleRef}
          value={title}
          color="black"
          fontSize={24}
          fontWeight="bold"
          onKeyPress={handleTitleKeyPress}
          whiteSpace="pre-wrap"
          placeholder="Title"
          borderWidth={0}
          borderRadius={0}
          onChangeText={handleTitleChange}
          backgroundColor="white"
        />
        <TextArea
          ref={contentRef}
          value={content}
          width="100%"
          color="black"
          fontSize={14}
          onKeyPress={handleContentKeyPress}
          whiteSpace="pre-wrap"
          placeholder="Start writing your notes..."
          borderWidth={0}
          borderRadius={0}
          height="90%"
          onChangeText={setContent}
          backgroundColor="white"
        />
      </YStack>
    )
  }
)

export default NoteInputForm
