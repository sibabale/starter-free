import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useRef } from 'react'
import { YStack, XStack } from 'tamagui'

import BackButton from 'app/components/atoms/BackButton'
import NoteInputForm from 'app/components/molecules/NoteInputForm'
import { useNoteManager } from 'app/hooks/useNoteManger'

const Screen: React.FC = () => {
  const noteInputFormRef = useRef<any>(null)
  const { selectedNote, handleNoteChange } = useNoteManager()
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
            <BackButton path="/" />
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
