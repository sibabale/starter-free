import { Note } from '../../types/note'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { loadNotes } from '../../utils/storage'
import { useRouter } from 'solito/navigation'
import { useFocusEffect } from '@react-navigation/native'
import React, { useState } from 'react'
import { H4, YStack, XStack, Button, ScrollView } from 'tamagui'

import NoteItem from '../../components/molecules/NoteItem'

export function NoteListScreen() {
  const [notes, setNotes] = useState<Note[]>([])
  const router = useRouter()

  useFocusEffect(
    React.useCallback(() => {
      const fetchNotes = async () => {
        const loadedNotes = await loadNotes()
        setNotes(loadedNotes)
      }
      fetchNotes()
      return () => {}
    }, [])
  )

  return (
    <YStack padding="$4" backgroundColor="white" space flex={1} jc="center">
      <XStack alignItems="center">
        <Button unstyled icon={<ArrowLeft size="$2" />} onPress={() => router.push('/')} />
        <H4 marginLeft="$5">All Notes</H4>
      </XStack>
      <ScrollView showsVerticalScrollIndicator={false}>
        {notes.length > 0 ? (
          notes.map((note) => <NoteItem key={note.id} note={note} />)
        ) : (
          <Button onPress={() => router.push('/notes/create')}>Create New Note</Button>
        )}
      </ScrollView>
    </YStack>
  )
}
