import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Icon,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  useBreakpointValue,
  Spinner,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { RiAddLine, RiPencilLine } from "react-icons/ri";
import { RxUpdate } from "react-icons/rx";
import NextLink from "next/link";

import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { useUsers } from "../../hooks/useUsers";
import { getSession } from "@auth0/nextjs-auth0";
import { GetServerSideProps } from "next";
import { getUser } from "../../hooks/useUser";
import { NextSeo } from "next-seo";
import { useMutation, useQueryClient } from "react-query";
import { BsTrash } from "react-icons/bs";
import { api } from "../../services/axios";

export default function UserList() {
  const queryClient = useQueryClient();
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState<string[]>([]);
  const [isDeletingUsersModalOpen, setIsDeletingUsersModalOpen] =
    useState(false);
  const [page, setPage] = useState(1);
  const registersPerPage: number = 10;
  const { data, isLoading, isFetching, error, refetch } = useUsers(
    page,
    registersPerPage
  );

  const router = useRouter();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  function onPageChange(number: number) {
    const isBrowser = () => typeof window !== "undefined";

    setPage(number);
    setIsCheckAll(false);
    setIsCheck([]);

    if (!isBrowser()) return;
    window.scrollTo({ top: 0 });
  }

  function prefetchUserWithId(userId: string) {
    queryClient.prefetchQuery(["users", userId], () => getUser(userId), {
      staleTime: 1000 * 60 * 10, // 10 min
    });
  }

  function handleSelectAll(e: React.FormEvent<HTMLInputElement>) {
    setIsCheckAll(!isCheckAll);
    setIsCheck(data!.users.map((user) => user?.id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  }

  function handleClick(e: React.FormEvent<HTMLInputElement>) {
    const { id, checked } = e.target as HTMLInputElement;
    setIsCheck([...(isCheck as string[]), id]);
    if (!checked) {
      setIsCheck(isCheck!.filter((item) => item !== id));
    }
  }

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

  function handleOpenDeletingUsersModal() {
    setIsDeletingUsersModalOpen(true);
  }

  function handleCloseDeletingUsersModal() {
    setIsDeletingUsersModalOpen(false);
  }

  const handleDeleteUser = async () => {
    if (isCheck?.length === 1) {
      if (!confirm("Deseja deletar este usuário?")) {
        return;
      }
    } else {
      if (!confirm(`Deseja deletar ${isCheck?.length} usuários?`)) {
        return;
      }
    }

    try {
      handleOpenDeletingUsersModal()
      isCheck?.map(async (userId: string) => {
        await deleteUser.mutateAsync(userId);
        return userId;
      });

      setIsCheck([])

    } catch (error: any) {
      if (error?.response?.status === 409) {
        return alert(error?.response?.data);
      }
      return console.error(error?.response?.data);
    }
  };
  return (
    <>
      <NextSeo title="jandash | Usuários" />
      <Box>
        <Modal
          isOpen={isDeletingUsersModalOpen}
          onClose={() => handleCloseDeletingUsersModal()}
        >
          <ModalOverlay />
          <ModalContent
            alignItems="center"
            justifyContent="center"
            bg="gray.600"
          >
            <ModalHeader>Deletando usuários</ModalHeader>
            <ModalBody>
              {
              isCheck.length === 0
              ? "Todos os usuários foram apagados."
              : <Spinner />
              }
              </ModalBody>

            <ModalFooter justifyContent="center">
              <Button
                colorScheme="red"
                onClick={() => handleCloseDeletingUsersModal()}
              >
                Ok
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Header />

        <Flex w="100%" my="6" maxWidth={1480} mx="auto" px={["2", "4", "6"]}>
          <Sidebar />

          <Box flex="1" borderRadius={8} bg="gray.800" p={["4", "6"]}>
            <Flex
              direction={["column", "column", "column", "row"]}
              mb="8"
              justify="space-between"
              align="center"
            >
              <Heading size="lg" fontWeight="normal">
                Usuários
                {!isLoading && isFetching && (
                  <Spinner color="gray.500" ml="4" size="sm" />
                )}
              </Heading>

              <HStack mt={isWideVersion ? "" : "4"}>
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
                  onClick={() => handleDeleteUser()}
                  cursor="pointer"
                  as="a"
                  size="sm"
                  fontSize="sm"
                  colorScheme="red"
                  leftIcon={<Icon as={BsTrash} fontSize="16" />}
                >
                  Deletar
                </Button>

                <Button
                  onClick={() => router.push("/users/create")}
                  cursor="pointer"
                  as="a"
                  size="sm"
                  fontSize="sm"
                  colorScheme="red"
                  leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                >
                  Criar novo
                </Button>
              </HStack>
            </Flex>

            {isLoading ? (
              <Flex justify="center">
                <Spinner />
              </Flex>
            ) : error ? (
              <Flex justify="center">
                <Text>Falha ao obter dados dos usuários.</Text>
              </Flex>
            ) : (
              <>
                <Table colorScheme="whiteAlpha">
                  <Thead>
                    <Tr>
                      <Th px={["2", "4", "6"]} color="gray.300" width="8">
                        <Checkbox
                          colorScheme="red"
                          onChange={(e: React.FormEvent<HTMLInputElement>) =>
                            handleSelectAll(e)
                          }
                        />
                      </Th>
                      <Th p={["2", "4", "6"]}>Usuário</Th>
                      {isWideVersion && <Th>Data de cadastro</Th>}
                      <Th w="8"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.users?.map((user) => (
                      <Tr key={user.id}>
                        <Td px={["2", "4", "6"]}>
                          <Checkbox
                            id={user?.id}
                            onChange={(e: React.FormEvent<HTMLInputElement>) =>
                              handleClick(e)
                            }
                            isChecked={isCheck?.includes(user.id)}
                            colorScheme="red"
                          />
                        </Td>
                        <Td p={["2", "4", "6"]}>
                          <Box>
                            <NextLink href={`/users/${user.id}`}>
                              <Text
                                onMouseEnter={() =>
                                  prefetchUserWithId(String(user.id))
                                }
                                fontWeight="bold"
                                fontSize={["sm", "md", "lg"]}
                                _hover={{ color: "purple.300" }}
                              >
                                {user.name}
                              </Text>
                            </NextLink>
                            <Text
                              w={[40, "auto"]}
                              isTruncated
                              fontSize="smaller"
                              color="gray.300"
                            >
                              {user.email}
                            </Text>
                          </Box>
                        </Td>
                        {isWideVersion && <Td>{user.created_at}</Td>}
                        <Td p={["2", "4", "6"]}>
                          <Button
                            cursor="pointer"
                            as="a"
                            size="sm"
                            fontSize="sm"
                            colorScheme="red"
                            leftIcon={<Icon as={RiPencilLine} fontSize="18" />}
                            iconSpacing={["0", "0", "0", "2"]}
                            onClick={() =>
                              router.push(`/users/edit/${user.id}`)
                            }
                          >
                            {isWideVersion ? "Editar" : ""}
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>

                <Pagination
                  registersPerPage={registersPerPage}
                  totalCountOfRegisters={data?.totalCount!}
                  currentPage={page}
                  onPageChange={onPageChange}
                />
              </>
            )}
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

  if (!lastUrl?.includes("localhost:3000")) {
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
