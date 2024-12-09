import React from 'react'
import { Button } from 'tamagui'
import { useRouter } from 'solito/navigation'
import { ArrowLeft } from '@tamagui/lucide-icons'

const BackButton = ({ path }: { path: string }) => {
  const router = useRouter()

  return <Button icon={<ArrowLeft size="$2" />} onPress={() => router.push(path)} unstyled />
}
export default BackButton
