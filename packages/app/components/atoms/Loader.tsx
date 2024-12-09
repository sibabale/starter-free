'use client'

import React from 'react'
import { YStack, Spinner, Text } from 'tamagui'

const Loader: React.FC = () => {
  return (
    <YStack
      flex={1}
      width={window.innerWidth}
      height={window.innerHeight}
      alignItems="center"
      justifyContent="center"
      backgroundColor="white"
    >
      <Spinner size="large" color="gray" />
      <Text fontSize="$4" fontWeight="bold" color="gray" marginTop="$3">
        Loading...
      </Text>
    </YStack>
  )
}

export default Loader
