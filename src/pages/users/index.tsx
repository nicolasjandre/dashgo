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
  Link,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { RiAddLine, RiPencilLine } from "react-icons/ri";
import { RxUpdate } from "react-icons/rx";

import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";
import { useUsers } from "../../services/hooks/useUsers";
import { queryClient } from "../../services/QueryClient";

type User = {
  name: string;
  email: string;
  id: string;
  created_at: string;
};

export default function UserList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, error, refetch } = useUsers(page);

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

  async function handlePrefetchUser(userId: number) {
    await queryClient.prefetchQuery(
      ["users", userId],
      async () => {
        const response = await api.get(`users/${userId}`);
        return response.data;
      },
      {
        staleTime: 1000 * 60 * 10, // 10 min
      }
    );
  }

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px={["2", "4", "6"]}>
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p={["4", "6"]}>
          <Flex
            direction={isWideVersion ? "row" : "column"}
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
                  {data?.users?.map((user: User) => (
                    <Tr key={user.id}>
                      <Td px={["2", "4", "6"]}>
                        <Checkbox colorScheme="red" />
                      </Td>
                      <Td p={["2", "4", "6"]}>
                        <Box>
                          <Link
                            onMouseEnter={() =>
                              handlePrefetchUser(Number(user.id))
                            }
                            _hover={{ color: "purple.300" }}
                          >
                            <Text
                              fontWeight="bold"
                              fontSize={["sm", "md", "lg"]}
                            >
                              {user.name}
                            </Text>
                          </Link>
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
                        >
                          {isWideVersion ? "Editar" : ""}
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <Pagination
                totalCountOfRegisters={data!.totalCount}
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
