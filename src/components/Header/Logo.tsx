import { Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

export function Logo() {
  const router = useRouter()

  return (
      <Text cursor='pointer' onClick={() => router.push('/dashboard')} fontSize={['xl', '3xl']} fontWeight="bold" letterSpacing="tight" w="64">
        dashgo
        <Text ml="1 " as="span" color="red.500">
          .
        </Text>
      </Text>
  )
}