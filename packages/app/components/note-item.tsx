import React from 'react'
import { useRouter } from 'solito/navigation'
import { Text, Stack } from 'tamagui'

import { Note } from '../types/note'
import { useNoteManager } from '../hooks/useNoteManger'
interface NoteItemProps {
  note: Note
  active: boolean
}

const NoteItem: React.FC = ({ note, active }: NoteItemProps) => {
  const router = useRouter()
  const { handleNoteSelection, selectedNote } = useNoteManager()

  const handleNoteClick = () => {
    handleNoteSelection(note.id)
    router.push(`/notes/${note.id}`)
  }

  return (
    <Stack
      height={100}
      cursor="pointer"
      paddingVertical="$3"
      paddingHorizontal="$4"
      borderBottomWidth={1}
      borderBottomColor="lightgray"
      backgroundColor={active ? 'black' : 'white'}
      onPress={handleNoteClick}
    >
      <Text fontWeight="bold" color={active ? 'white' : 'black'}>
        {note?.title || 'Untitled'}
      </Text>
      <Stack flex={1} marginTop="$2">
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          color={active ? 'white' : 'black'}
          fontWeight={100}
        >
          {note?.content || 'No content available'}
        </Text>
      </Stack>
    </Stack>
  )
}
export default React.memo(NoteItem)
