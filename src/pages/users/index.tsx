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
import { useUserPrefetch } from "../../hooks/useUser";

export default function UserList() {
  const [page, setPage] = useState(1);
  const registersPerPage: number = 10
  const { data, isLoading, isFetching, error, refetch } = useUsers(page, registersPerPage);

  const router = useRouter();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  function onPageChange(number: number) {
    const isBrowser = () => typeof window !== "undefined";

    setPage(number);

    if (!isBrowser()) return;
    window.scrollTo({ top: 0 });
  }

  function handlePrefetch(userId: string) {
    useUserPrefetch(userId)
  }

  return (
    <Box>
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
                      <Checkbox colorScheme="red" />
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
                        <Checkbox colorScheme="red" />
                      </Td>
                      <Td p={["2", "4", "6"]}>
                        <Box>
                          <NextLink href={`/users/${user.id}`}>
                            <Text
                              onMouseEnter={() =>
                                handlePrefetch(String(user.id))
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
