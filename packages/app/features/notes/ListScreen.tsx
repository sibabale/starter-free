import { Search, } from '@tamagui/lucide-icons'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { useRouter } from 'solito/navigation'
import { useFocusEffect } from '@react-navigation/native'
import React, { useState } from 'react'
import {Input, H4, YStack, XStack, Button, ScrollView } from 'tamagui'

import NoteItem from '../../components/molecules/NoteItem'
import { loadNotes } from '../../utils/storage'
import { useNoteManager } from '../../hooks/useNoteManger'

export function NoteListScreen() {
  const router = useRouter()
  const [isSearching, setIsSearching] = useState(false)

  const {
    searchQuery,
    notes: filteredNotes,
    handleSearchQueryChange,
  } = useNoteManager()

  useFocusEffect(
    React.useCallback(() => {
      const fetchNotes = async () => {
        await loadNotes()
      }
      fetchNotes()
      return () => {}
    }, [])
  )

  return (
    <YStack padding="$4" backgroundColor="white" space flex={1} jc="center">
      <XStack alignItems="center" jc="space-between">
        <Button unstyled icon={<ArrowLeft size="$2" />} onPress={() => router.push('/')} />
        {!isSearching && <H4 marginLeft="$5">All Notes</H4>}
        <XStack paddingHorizontal="$3" backgroundColor="white" alignItems="center">
    
          {isSearching && (
            <Input
              color="black"
              width="90%"
              value={searchQuery}
              fontSize="$3"
              onChangeText={handleSearchQueryChange}
              placeholder="Search"
              borderColor="transparent"
              borderWidth={0}
              borderRadius={0}
              paddingVertical="$2"
              backgroundColor="white"
              paddingHorizontal="$2"
            />
          )}

<Button
            unstyled 
            icon={<Search color="gray" size="$2" />} 
            onPress={() => setIsSearching(!isSearching)} 
          />
         
        </XStack>
      </XStack>
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => <NoteItem key={note.id} note={note} />)
        ) : (
          <Button onPress={() => router.push('/notes/create')}>Create New Note</Button>
        )}
      </ScrollView>
    </YStack>
  )
}
