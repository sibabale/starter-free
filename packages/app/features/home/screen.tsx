import { H1, YStack, XStack, Button, Paragraph, Separator } from '@my/ui'
import { Platform } from 'react-native'
import { useNoteManager } from '../../hooks/useNoteManger'
import { useRouter, useLink } from 'solito/navigation'

export function HomeScreen({ pagesMode = false }: { pagesMode?: boolean }) {
  const linkToNotesList = useLink({
    href: '/notes/list',
  })

  const router = useRouter()

  const { handleCreateNote } = useNoteManager()

  return (
    <YStack f={1} jc="center" ai="center" gap="$8" p="$4" backgroundColor="white">
      <YStack gap="$4" ai="center">
        <H1 ta="center" col="black">
          Nota
        </H1>
        <Paragraph col="$color10" ta="center">
          Capture your thoughts, organize your ideas
        </Paragraph>

        <Separator marginVertical="$4" />
        {Platform.OS !== 'web' && (
          <XStack gap="$4">
            <Button {...linkToNotesList}>View Notes</Button>

            <Button
              onPress={async () => {
                const newNote = await handleCreateNote()
                router.push(`/notes/${newNote.id}`)
              }}
            >
              Create Note
            </Button>
          </XStack>
        )}
      </YStack>
    </YStack>
  )
}
