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

import { RxUpdate } from "react-icons/rx";
import { RiPencilLine } from "react-icons/ri";
import { BsTrash } from "react-icons/bs";
import { getSession } from "@auth0/nextjs-auth0";
import { GetServerSideProps } from "next";
import { useUser } from "../../hooks/useUser";
import { useMutation } from "react-query";
import { api } from "../../services/axios";
import { queryClient } from "../../services/ReactQueryClient";
import { NextSeo } from "next-seo";

export default function EditUser() {
  const router = useRouter();
  const userId = String(router.query.userId);

  const { data, isFetching, refetch } = useUser(userId);

  const deleteUser = useMutation(
    async (userId: string) => {
      try {
        await api.delete("users/delete", {
          data: { userId },
        });
      } catch (e) {
        console.log(e);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
    }
  );

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Deseja apagar este usuário?")) {
      return;
    }

    try {
      await deleteUser.mutateAsync(userId);
    } catch (error: any) {
      if (error?.response?.status === 409) {
        return alert(error?.response?.data);
      }
      return console.error(error?.response?.data);
    }

    alert("Usuário apagado com sucesso!");
    router.push("/users");
  };

  return (
    <>
      <NextSeo title={`Perfil | ${data?.user?.name}`} />
      <Box>
        <Header />

        <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
          <Sidebar />

          <Box flex="1" borderRadius={8} bg="gray.800" p={["4", "6", "8"]}>
            <Heading
              display="flex"
              justifyContent={["center", "center", "space-between"]}
              alignItems={["center", "center", "space-between"]}
              size="lg"
              fontWeight="normal"
              flexDir={["column", "column", "row"]}
            >
              <Flex alignItems="center" gap="3">
                <Avatar size={["sm", "md"]} name={data?.user?.name} />
                <Text fontSize={["16", "20", "26"]} as="span" color="red.500">
                  {data?.user?.name}
                  {isFetching && <Spinner color="gray.500" ml="4" size="sm" />}
                </Text>
              </Flex>

              <HStack mt={["4", "4", "0"]}>
                <Button
                  onClick={() => refetch()}
                  cursor="pointer"
                  as="a"
                  size="sm"
                  fontSize="sm"
                  colorScheme="red"
                  leftIcon={<Icon as={RxUpdate} fontSize="16" />}
                >
                  Atualizar
                </Button>

                <Button
                  onClick={() => handleDeleteUser(userId)}
                  cursor="pointer"
                  as="a"
                  size="sm"
                  fontSize="sm"
                  colorScheme="red"
                  leftIcon={<Icon as={BsTrash} fontSize="16" />}
                >
                  Apagar
                </Button>
              </HStack>
            </Heading>

            <Divider my="6" borderColor="gray.700" />

            <Stack spacing="4">
              <Box>
                <Text as="strong">Nome: </Text>
                <Text as="span">{data?.user?.name}</Text>
              </Box>

              <Box>
                <Text as="strong">E-mail: </Text>
                <Text as="span">{data?.user?.email}</Text>
              </Box>

              <Box>
                <Text as="strong">Gênero: </Text>
                <Text as="span">{data?.user?.sex}</Text>
              </Box>

              <Box>
                <Text as="strong">Profissão: </Text>
                <Text as="span">{data?.user?.profession}</Text>
              </Box>

              <Box>
                <Text as="strong">Cadastro: </Text>
                <Text as="span">{data?.user?.created_at}</Text>
              </Box>

              <Box>
                <Text as="strong">Editado em: </Text>
                <Text as="span">{data?.user?.updated_at}</Text>
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
    </>
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
