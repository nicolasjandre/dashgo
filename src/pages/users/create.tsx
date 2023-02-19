import { Box, Divider, Flex, Heading, HStack, SimpleGrid, VStack, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Input } from "../../components/Form/input";

import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";

import styles from './styles.module.scss'

export default function CreateUser() {
  const router = useRouter()

  return (
    <Box>
      <Header />

      <Flex w='100%' my='6' maxWidth={1480} mx='auto' px='6'>
        <Sidebar />

        <Box className={styles.input} flex='1' borderRadius={8} bg='gray.800' p={['4', '6', '8']}>
            <Heading size='lg' fontWeight='normal'>Criar usuário</Heading>

            <Divider my='6' borderColor='gray.700'/>

            <VStack spacing='8'>
              <SimpleGrid minChildWidth='220px' spacing='8' w='100%'>
                <Input isRequired name='name' label='Nome completo:' />
                <Input isRequired name='email' type='email' label='E-mail:' />
              </SimpleGrid>

              <SimpleGrid minChildWidth='220px' spacing='8' w='100%'>
                <Input isRequired name='password' type='password' label='Senha:' />
                <Input isRequired name='password_confirmation' type='password' label='Confirmar senha:' />
              </SimpleGrid>
            </VStack>

            <Flex mt='8' justify='flex-end'>
              <HStack spacing='4'>
                <Button onClick={() => {router.push('/users')}} cursor='pointer' as='a' colorScheme='whiteAlpha'>Cancelar</Button>
                <Button colorScheme='red'>Salvar</Button>
              </HStack>
            </Flex>
        </Box>
      </Flex>
    </Box>
  )
}