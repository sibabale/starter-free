import { NoteListScreen } from 'app/features/notes/list-screen'
import { Stack } from 'expo-router'
import { useParams } from 'solito/navigation'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  const { id } = useParams()
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
