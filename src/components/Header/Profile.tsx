import { useUser } from "@auth0/nextjs-auth0/client";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRealUser } from "../../hooks/useRealUser";

export function Profile() {
  const route = useRouter()
  const { user } = useUser();
  const { data, refetch } = useRealUser(user?.email as string);

  if (!data?.user) {
    refetch()
  }

  return (
    <Flex align="center" mr="2">
      <Box display={["none", "none", "block"]} textAlign="right" pr='6'>
        <Text>{data?.user?.name}</Text>
        <Text color="gray.300" fontSize="small">
          {data?.user?.email}
        </Text>
        {data?.user?.needUpdateProfile && (
          <Link href="/profile/edit">
            <Text pt="2" color="red.400" fontSize="sm">
              Novo usuário? Edite seu perfil!
            </Text>
          </Link>
        )}
      </Box>

      <Avatar
        size="md"
        name={data?.user?.name!}
        src={data?.user?.picture !== "none" ? data?.user?.picture : undefined}
        onClick={() => route.push("/profile")}
      />
    </Flex>
  );
}
