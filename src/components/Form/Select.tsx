import { Select, FormControl, FormLabel, FormErrorMessage, Box, SelectProps as ChakraSelectProps } from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction, ReactElement, ReactNode } from "react";
import { FieldError } from "react-hook-form";

interface SelectCompProps extends ChakraSelectProps {
  name: string;
  label?: string;
  error?: FieldError;
  children: ReactNode;
}

const SelectComp: ForwardRefRenderFunction<HTMLSelectElement, SelectCompProps> = (
  { name, label, error = null, children, isRequired, ...rest },
  ref
) => {
  return (
    <Box>
      <FormControl isInvalid={!!error}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
        <Select
          name={name}
          id={name}
          variant="filled"
          bgColor="gray.900"
          borderColor="gray.900"
          focusBorderColor="red.500"
          _hover={{ bgColor: "gray.900" }}
          _focus={{ bgColor: "gray.900" }}
          size="lg"
          ref={ref}
          {...rest}
        >
          {children}
        </Select>

        {!!error && <FormErrorMessage>{String(error.message)}</FormErrorMessage>}
      </FormControl>
    </Box>
  );
}

export const SelectComponent = forwardRef(SelectComp);