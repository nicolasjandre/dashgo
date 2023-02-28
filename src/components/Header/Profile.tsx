import { useUser } from "@auth0/nextjs-auth0/client";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

export function Profile() {
  const { user } = useUser()

  return (
    <Flex align="center">

        <Box display={['none', 'none', 'block']} mr="4" textAlign="right">
          <Text>{user?.name}</Text>
          <Text color="gray.300" fontSize="small">
            {user?.email}
          </Text>
        </Box>

      <Avatar
        size={["sm", "md"]}
        name={user?.name!}
        src={user?.picture!}
      />
    </Flex>
  );
}
