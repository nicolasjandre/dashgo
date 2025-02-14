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
import { RiPencilLine } from "react-icons/ri";
import { getSession } from "@auth0/nextjs-auth0";
import { GetServerSideProps } from "next";
import { useUser } from "@auth0/nextjs-auth0/client";
import { NextSeo } from "next-seo";
import { useRealUser } from "../../hooks/useRealUser";

export default function EditUser() {
  const router = useRouter();
  const auth0User = useUser();

  const { data, isFetching, refetch } = useRealUser(
    auth0User?.user?.email as string
  );

  return (
    <>
      <NextSeo title={"Jandash | Meu perfil"} />
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
                  colorScheme="red"
                  onClick={() => router.push("/profile/edit/")}
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
