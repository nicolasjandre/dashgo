import { Text } from "@chakra-ui/react";
import Link from "next/link";

export function Logo({ ...rest }) {
  return (
    <Link href="/dashboard">
      <Text
        display="block"
        cursor="default"
        fontSize={["27px", "3xl"]}
        fontWeight="bold"
        letterSpacing="tight"
        {...rest}
      >
        jandash
        <Text ml="1 " as="span" color="red.500">
          .
        </Text>
      </Text>
    </Link>
  );
}
