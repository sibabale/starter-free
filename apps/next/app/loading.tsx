'use client'

import React from 'react'
import { YStack, Spinner, Text } from 'tamagui'

const LoadingScreen = () => {
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      backgroundColor="white"
      height={window.innerHeight}
      width={window.innerWidth}
    >
      <Spinner size="large" color="gray" />
      <Text fontSize="$4" fontWeight="bold" color="gray" marginTop="$3">
        Loading...
      </Text>
    </YStack>
  )
}

export default LoadingScreen
