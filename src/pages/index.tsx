import { Button, Flex, Stack } from "@chakra-ui/react";
import { Input } from "../components/Form/input";

import styles from './styles.module.scss'

export default function Home() {
  return (
   <Flex w="100vw" h="100vh" align="center" justify="center" p={['4', '6']}>
      <Flex as='form' width='100%' maxWidth={360} bg='gray.800' p={['4', '6']} borderRadius={8} flexDir='column'>
        <Stack className={styles.input} spacing='4'>
          <Input className={styles.input} label='E-mail:' type='email' name='email' isRequired={true}/>
          <Input className={styles.input} label='Senha:' type='password' name='password' isRequired={true}/>

         <Button type='submit' colorScheme='red' size='lg'>
              Entrar
          </Button>
        </Stack>
      </Flex>
    </Flex>
  );
}
