import { Text } from "@chakra-ui/react";

export function Logo({ ...rest }) {
  return (
    <Text
      display='block'
      cursor="default"
      fontSize={['xl', '3xl']}
      fontWeight="bold"
      letterSpacing="tight"
      {...rest}
    >
      jandash
      <Text ml="1 " as="span" color="red.500">
        .
      </Text>
    </Text>
  );
}
