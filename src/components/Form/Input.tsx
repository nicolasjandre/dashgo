import {
  FormLabel,
  Input as ChakraInput,
  FormControl,
  InputProps as ChakraInputProps,
  InputRightElement,
  Button,
  InputGroup,
  Icon,
  FormErrorMessage,
} from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction, useState } from "react";
import { FieldError } from "react-hook-form";

import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError;
  type?: string;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, label, type, error = null, ...rest },
  ref
) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return type === "password" ? (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <InputGroup size="md">
        <ChakraInput
          name={name}
          id={name}
          variant="filled"
          bgColor="gray.900"
          focusBorderColor="red.500"
          _hover={{ bgColor: "gray.900" }}
          _focus={{ bgColor: "gray.900" }}
          size="lg"
          type={show ? "text" : "password"}
          ref={ref}
          {...rest}
        />

        <InputRightElement h="100%" width="4rem">
          <Button colorScheme="red" h="1.75rem" size="sm" onClick={handleClick}>
            <Icon as={show ? RiEyeOffLine : RiEyeLine} fontSize="20" />
          </Button>
        </InputRightElement>
      </InputGroup>

      {!!error && <FormErrorMessage>{String(error?.message)}</FormErrorMessage>}
    </FormControl>
  ) : (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <ChakraInput
        name={name}
        id={name}
        type={type}
        variant="filled"
        bgColor="gray.900"
        focusBorderColor="red.500"
        _hover={{ bgColor: "gray.900" }}
        _focus={{ bgColor: "gray.900" }}
        size="lg"
        ref={ref}
        {...rest}
      />

      {!!error && <FormErrorMessage>{String(error.message)}</FormErrorMessage>}
    </FormControl>
  );
};

export const Input = forwardRef(InputBase);
