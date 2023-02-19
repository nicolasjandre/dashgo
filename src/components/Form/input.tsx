import { FormLabel, Input as ChakraInput, FormControl, InputProps as ChakraInputProps, InputRightElement, Button, InputGroup, Icon } from "@chakra-ui/react";
import { useState } from "react";

import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

interface InputProps extends ChakraInputProps {
  name: string,
  label?: string,
}

export function Input({ name, label, type, ...rest }: InputProps) {
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)

  return type === 'password' ? (
    <FormControl>
      {!! label && <FormLabel htmlFor={name}>{label}</FormLabel> }
      <InputGroup size='md'>
        <ChakraInput
          name={name}
          id={name}
          variant='filled'
          bgColor='gray.900'
          focusBorderColor='red.500'
          _hover={{bgColor: 'gray.900'}}
          _focus={{bgColor: 'gray.900'}}
          size='lg'
          {...rest}
          type={show ? 'text' : 'password'}
        />
        <InputRightElement h='100%' width='4rem'>
          <Button colorScheme='red' h='1.75rem' size='sm' onClick={handleClick}>
            <Icon as={show ? RiEyeOffLine : RiEyeLine} fontSize='20'/>
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>
  ) : (
    <FormControl>
      {!! label && <FormLabel htmlFor={name}>{label}</FormLabel> }
      <ChakraInput
        name={name}
        id={name}
        type={type}
        variant='filled'
        bgColor='gray.900'
        focusBorderColor='red.500'
        _hover={{bgColor: 'gray.900'}}
        _focus={{bgColor: 'gray.900'}}
        size='lg'
        {...rest}
      />
    </FormControl>
  )
}