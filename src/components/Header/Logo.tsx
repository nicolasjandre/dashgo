import { Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

export function Logo({ ...rest }) {
  let { asPath } = useRouter()

  return (
    <Text
      display='block'
      cursor="default"
      fontSize={[asPath === '/' ? '5xl' : 'xl', asPath === '/' ? '5xl' : '3xl']}
      fontWeight="bold"
      letterSpacing="tight"
      {...rest}
    >
      dashgo
      <Text ml="1 " as="span" color="red.500">
        .
      </Text>
    </Text>
  );
}
