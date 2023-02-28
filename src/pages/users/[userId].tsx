import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  Button,
  Text,
  Spinner,
  Icon,
  Avatar,
  Stack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";

import styles from "../styles.module.scss";

import { useUser } from "../../services/hooks/useUsers";
import { RxUpdate } from "react-icons/rx";
import { RiPencilLine } from "react-icons/ri";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { GetServerSideProps } from "next";

export default function EditUser() {
  const router = useRouter();
  const userId = Number(router.query.userId);

  const { user, response } = useUser(userId);

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box
          className={styles.input}
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={["4", "6", "8"]}
        >
          <Heading
            display="flex"
            justifyContent="space-between"
            size="lg"
            fontWeight="normal"
          >
            <Flex alignItems="center" gap="3">
              <Avatar size={["sm", "md"]} name={user?.name} />
              <Text fontSize={["16", "20", "26"]} as="span" color="red.500">
                {user?.name}
                {response.isFetching && (
                  <Spinner color="gray.500" ml="4" size="sm" />
                )}
              </Text>
            </Flex>

            <Button
              onClick={() => response.refetch()}
              cursor="pointer"
              as="a"
              size="sm"
              fontSize="sm"
              colorScheme="red"
              leftIcon={<Icon as={RxUpdate} fontSize="16" />}
            >
              Atualizar
            </Button>
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <Stack spacing="4">
            <Box>
              <Text as="strong">Nome: </Text>
              <Text as="span">{user?.name}</Text>
            </Box>

            <Box>
              <Text as="strong">E-mail: </Text>
              <Text as="span">{user?.email}</Text>
            </Box>

            <Box>
              <Text as="strong">Gênero: </Text>
              <Text as="span">{}</Text>
            </Box>

            <Box>
              <Text as="strong">Cadastro: </Text>
              <Text as="span">{user?.created_at}</Text>
            </Box>
          </Stack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Button
                size={["sm", "md"]}
                onClick={() => {
                  router.push("/users");
                }}
                cursor="pointer"
                as="a"
                colorScheme="whiteAlpha"
              >
                Voltar
              </Button>
              <Button
                size={["sm", "md"]}
                colorScheme="red"
                onClick={() => router.push(`/users/edit/${userId}`)}
                leftIcon={<Icon as={RiPencilLine} fontSize="18" />}
              >
                Editar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const response = await getSession(ctx.req, ctx.res);
  const session = JSON.parse(JSON.stringify(response));

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};