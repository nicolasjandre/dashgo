import { useUser } from "@auth0/nextjs-auth0/client";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRealUser } from "../../hooks/useRealUser";

export function Profile() {
  const { user } = useUser();
  const { data } = useRealUser(user?.email as string);

  return (
    <Flex align="center">
      <Box display={["none", "none", "block"]} mr="4" textAlign="right">
        <Text>{data?.user?.name}</Text>
        <Text color="gray.300" fontSize="small">
          {data?.user?.email}
        </Text>
        {data?.user?.needUpdateProfile && (
          <Link href="/profile">
            <Text pt="2" color="red.400" fontSize="sm">
              Novo usuário? Edite seu perfil!
            </Text>
          </Link>
        )}
      </Box>

      <Avatar
        size={["sm", "md"]}
        name={data?.user?.name!}
        src={data?.user?.picture !== "none" ? data?.user?.picture : undefined}
      />
    </Flex>
  );
}
