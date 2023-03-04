import { HStack, Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { RiProfileLine, RiLogoutBoxLine } from "react-icons/ri";

export function NotificationsNav() {
  const route = useRouter()
  const { asPath } = route

  return (
    <HStack
      spacing="4"
      mx={["6", "8"]}
      pr={["6", "8"]}
      py="1"
      color="gray.300"
      borderRightWidth={1}
      borderColor="gray.700"
    >
      <Icon cursor='pointer' onClick={() => route.push('/api/auth/logout')} as={RiLogoutBoxLine} fontSize={[19, 22]} />
    </HStack>
  );
}
