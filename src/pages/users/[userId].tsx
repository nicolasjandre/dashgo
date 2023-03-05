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
  useBreakpointValue,
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
import { useMutation, useQueryClient } from "react-query";
import { api } from "../../services/axios";
import { NextSeo } from "next-seo";
import { DeletingUsersModal } from "../../components/DeletingUsersModal";
import { useEffect, useState } from "react";

export default function EditUser() {
  const router = useRouter();
  const userId = String(router.query.userId);
  const queryClient = useQueryClient();
  const [isErrorOnDelete, setIsErrorOnDelete] = useState(false);
  const [isDeletingUsersModalOpen, setIsDeletingUsersModalOpen] =
    useState<boolean>(false);
  const [isConfirmingDeleteUsers, setIsConfirmingDeleteUsers] = useState(true);

  const isWideVersion = useBreakpointValue({
    base: false,
    md: true
  });

  const { data, isFetching, refetch } = useUser(userId);

  useEffect(() => {
    if (!data?.user) {
      refetch()
    }
  }, [data?.user])

  const deleteUser = useMutation(
    async (userId: string) => {
      const response = await api.delete("users/delete", {
        data: { userId },
      });

      return response;
    },
    {
      onError: (e) => {
        setIsErrorOnDelete(true);
        console.log(e);
      },
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
    }
  );

  function handleOpenDeletingUsersModal() {
    setIsDeletingUsersModalOpen(true);
  }

  function handleCloseDeletingUsersModal() {
    setIsErrorOnDelete(false);
    setIsDeletingUsersModalOpen(false);
  }

  const handleConfirmDeleteUser = () => {
    setIsConfirmingDeleteUsers(true);
    handleOpenDeletingUsersModal();
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setIsConfirmingDeleteUsers(false);
      await deleteUser.mutateAsync(userId);
      return userId;
    } catch (error: any) {
      if (error?.response?.status === 409) {
        return alert(error?.response?.data);
      }
      return console.error(error?.response?.data);
    }
  };

  return (
    <>
      <NextSeo title={`Perfil | ${data?.user?.name}`} />
      <Box>
        <Header />

        <DeletingUsersModal
          handleCloseDeletingUsersModal={handleCloseDeletingUsersModal}
          handleDeleteUser={handleDeleteUser}
          isConfirmingDeleteUsers={isConfirmingDeleteUsers}
          isDeletingUsersModalOpen={isDeletingUsersModalOpen}
          isErrorOnDelete={isErrorOnDelete}
          isLoading={deleteUser.isLoading}
          setIsConfirmingDeleteUsers={setIsConfirmingDeleteUsers}
          usersLength={1}
          userId={userId}
        />

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
              <Flex flexDir={["column", "column", "row"]} alignItems="center" gap="3">
                <Avatar size={["md", "lg"]} name={data?.user?.name} />
                <Text fontSize={["22", "26"]} as="span" color="red.500">
                  {data?.user?.name}
                  {isFetching && <Spinner color="gray.500" ml="4" size="sm" />}
                </Text>
              </Flex>
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
                  onClick={() => handleConfirmDeleteUser()}
                  cursor="pointer"
                  as="a"
                  size={["sm", "md"]}
                  iconSpacing={["0", "0", "2"]}
                  fontSize="sm"
                  colorScheme="red"
                  leftIcon={<Icon as={BsTrash} fontSize="16" />}
                >
                  {isWideVersion ? "Deletar" : ""}
                </Button>

                <Button
                  size={["sm", "md"]}
                  colorScheme="red"
                  iconSpacing={["0", "0", "2"]}
                  onClick={() => router.push(`/users/edit/${userId}`)}
                  leftIcon={<Icon as={RiPencilLine} fontSize="18" />}
                >
                  {isWideVersion ? "Editar" : ""}
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

  const lastUrl = ctx.req.headers.referer;

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!lastUrl?.includes(String(process.env.SITE_URL))) {
    return {
      redirect: {
        destination: "/prefetch",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
