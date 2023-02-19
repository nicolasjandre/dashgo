import { Box, Button, Checkbox, Flex, Heading, Icon, Table, Tbody, Td, Th, Thead, Tr, Text, useBreakpointValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { RiAddLine, RiPencilLine } from "react-icons/ri";

import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";

export default function UserList() {
  const router = useRouter()

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  })

  return (
    <Box>
      <Header />

      <Flex w='100%' my='6' maxWidth={1480} mx='auto' px={['2', '4', '6']}>
        <Sidebar />

        <Box flex='1' borderRadius={8} bg='gray.800' p={['4', '6']}>
          <Flex mb='8' justify='space-between' align='center'>
            <Heading size='lg' fontWeight='normal'>Usuários</Heading>
            
              <Button onClick={() => {router.push('/users/create')}} cursor='pointer' as='a' size='sm' fontSize='sm' colorScheme='red' leftIcon={<Icon as={RiAddLine} fontSize='20'/>}>
                Criar novo
              </Button>
          </Flex>

          <Table colorScheme='whiteAlpha'>
            <Thead>
              <Tr>
                <Th px={['2', '4', '6']} color='gray.300' width='8'>
                  <Checkbox colorScheme='red'/>
                </Th>
                <Th p={['2', '4', '6']}>Usuário</Th>
                { isWideVersion && <Th>Data de cadastro</Th> }
                <Th w='8'></Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td px={['2', '4', '6']}>
                  <Checkbox colorScheme='red'/>
                </Td>
                <Td p={['2', '4', '6']}>
                  <Box>
                    <Text fontWeight='bold' fontSize={['sm', 'md', 'lg']}>Nicolas Jandre</Text>
                    <Text fontSize='smaller' color='gray.300'>nicolasjandre@live.com</Text>
                  </Box>
                </Td>
                { isWideVersion && <Td>16 de Fevereiro de 2023</Td> }
                <Td p={['2', '4', '6']}>
                  <Button cursor='pointer' as='a' size='sm' fontSize='sm' colorScheme='red' leftIcon={<Icon as={RiPencilLine} fontSize='18'/>} iconSpacing={['0', '0', '0', '2']}>
                    { isWideVersion ? 'Editar' : ''}
                  </Button>
                </Td>
              </Tr>
            </Tbody>
          </Table>

          <Pagination />
        </Box>
      </Flex>
    </Box>
  )
}