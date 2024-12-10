import { NoteListScreen } from 'app/features/notes/ListScreen'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Notes',
          headerShown: false,
        }}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <NoteListScreen />
      </SafeAreaView>
    </>
  )
}
