import { router, Stack } from 'expo-router'
import { Trash2 } from '@tamagui/lucide-icons'
import { useParams } from 'solito/navigation'
import { SafeAreaView } from 'react-native-safe-area-context'
import { YStack, XStack, Button } from 'tamagui'
import React, { useRef, useEffect, useState } from 'react'

import { Note } from 'app/types/note'
import BackButton from 'app/components/atoms/back-button'
import NoteInputForm from 'app/components/molecules/NoteInputForm'
import { useNoteManager } from 'app/hooks/useNoteManger'
import { loadNotes, deleteNote } from 'app/utils/storage'

const Screen: React.FC = () => {
  const { id } = useParams()
  const noteInputFormRef = useRef<any>(null)
  const { handleNoteChange } = useNoteManager()

  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  useEffect(() => {
    const fetchNotes = async () => {
      const loadedNotes = await loadNotes()
      const selectedNote = loadedNotes.find((note) => note.id === id) || null
      setSelectedNote(selectedNote)
    }
    fetchNotes()
  }, [])

  const handleDeleteNote = async () => {
    if (selectedNote?.id) {
      await deleteNote(selectedNote.id)
      router.push('/notes/list')
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerShown: false,
        }}
      />
      <SafeAreaView style={{ backgroundColor: 'white' }}>
        <YStack padding="$4" backgroundColor="white" space>
          <XStack alignItems="center" justifyContent="space-between">
            <BackButton path="/notes/list" />
            <Button onPress={handleDeleteNote} unstyled icon={<Trash2 color="red" />}></Button>
          </XStack>

          <NoteInputForm
            ref={noteInputFormRef}
            onChange={handleNoteChange}
            currentNoteId={selectedNote?.id}
            initialTitle={selectedNote?.title || ''}
            initialContent={selectedNote?.content || ''}
          />
        </YStack>
      </SafeAreaView>
    </>
  )
}

export default Screen
