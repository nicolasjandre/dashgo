import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  VStack,
  Button,
  Text,
  Spinner,
  Icon,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Input } from "../../../components/Form/Input";

import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";

import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import professions from "../../../utils/professions.json";

import styles from "../../../styles/styles.module.scss";
import { useMutation, useQueryClient } from "react-query";
import { api } from "../../../services/axios";
import { useUser } from "../../../hooks/useUser";
import { RxUpdate } from "react-icons/rx";
import { getSession } from "@auth0/nextjs-auth0";
import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import { capitalize } from "../../../utils/capitalize";

interface EditUser {
  name: string;
  email: string;
  sex: string;
  profession: string;
}

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const editUserFormSchema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório."),

  email: yup
    .string()
    .required("E-mail é obrigatório.")
    .email("Digite um e-mail válido.")
    .matches(emailRegex, "Digite um e-mail válido."),
});

export default function EditUser() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = String(router.query.userId);

  const { data, isFetching, refetch } = useUser(userId);

  const { register, handleSubmit, formState } = useForm<EditUser>({
    resolver: yupResolver(editUserFormSchema),
  });

  const editUser = useMutation(
    async (user: EditUser) => {
      try {
        const response = await api.patch(`users/update`, {
          user: {
            name: capitalize(user?.name),
            email: user?.email.toLowerCase(),
            sex: user?.sex,
            profession: user?.profession,
            id: userId,
          },
        });

        return response;
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
  const { errors } = formState;

  const handleEditUser: SubmitHandler<EditUser> = async (data) => {
    try {
      await editUser.mutateAsync(data);
    } catch (error: any) {
      if (error?.response?.status === 409) {
        return alert(error?.response?.data);
      }
      return console.error(error?.response?.data);
    }
    alert("Usuário editado com sucesso!");
    router.push("/users");
  };

  return (
    <>
      <NextSeo title={`Editar | ${data?.user?.name}`} />
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
              flexDir={["column", "column", "row"]}
              justifyContent={["center", "center", "space-between"]}
              alignItems={["center"]}
              size="lg"
              fontWeight="normal"
            >
              <Text
                display={["inline", "inline", "none"]}
                as="span"
                color="white"
                align="center"
              >
                Editando usuário:{" "}
              </Text>
              <Text
                display={["inline", "inline", "none"]}
                as="span"
                color="red.500"
                align="center"
              >
                {data?.user?.name}

                {isFetching && (
                  <Spinner
                    display={["block", "block", "none"]}
                    color="gray.500"
                    ml="4"
                    size="sm"
                  />
                )}
              </Text>

              <Text
                display={["none", "none", "inline"]}
                as="span"
                color="white"
                align="center"
              >
                Editando usuário:{" "}
                <Text
                  display={["none", "none", "inline"]}
                  as="span"
                  color="red.500"
                  align="center"
                >
                  {data?.user?.name}
                </Text>
                {isFetching && (
                  <Spinner
                    display={["none", "none", "block"]}
                    color="gray.500"
                    ml="4"
                    size="sm"
                  />
                )}
              </Text>

              <Button
                onClick={() => refetch()}
                cursor="pointer"
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="red"
                leftIcon={<Icon as={RxUpdate} fontSize="16" />}
                maxW="260px"
                mt={["4", "4", "0"]}
              >
                Atualizar
              </Button>
            </Heading>

            <Divider my="6" borderColor="gray.700" />

            <VStack spacing="8">
              <SimpleGrid minChildWidth="220px" spacing="8" w="100%">
                <Input
                  {...register("name")}
                  error={errors.name}
                  name="name"
                  label="Nome completo:"
                  isRequired
                />
                <Input
                  {...register("email")}
                  error={errors.email}
                  name="email"
                  type="email"
                  label="Novo e-mail:"
                  isRequired
                />
              </SimpleGrid>

              <SimpleGrid minChildWidth="220px" spacing="8" w="100%">
                <Box>
                  <FormLabel htmlFor="sex">Gênero: </FormLabel>
                  <Select
                    {...register("sex")}
                    name="sex"
                    id="sex"
                    variant="filled"
                    bgColor="gray.900"
                    borderColor="gray.900"
                    focusBorderColor="red.500"
                    _hover={{ bgColor: "gray.900" }}
                    _focus={{ bgColor: "gray.900" }}
                    size="lg"
                  >
                    <option style={{ background: "#181B23" }} value="Masculino">
                      Masculino
                    </option>
                    <option style={{ background: "#181B23" }} value="Feminino">
                      Feminino
                    </option>
                    <option
                      style={{ background: "#181B23" }}
                      value="Prefiro não responder"
                    >
                      Prefiro não responder
                    </option>
                  </Select>
                </Box>

                <Box>
                  <FormLabel htmlFor="profession">Profissão: </FormLabel>
                  <Select
                    {...register("profession")}
                    name="profession"
                    id="profession"
                    variant="filled"
                    bgColor="gray.900"
                    borderColor="gray.900"
                    focusBorderColor="red.500"
                    _hover={{ bgColor: "gray.900" }}
                    _focus={{ bgColor: "gray.900" }}
                    size="lg"
                  >
                    {professions.profissoes.map((profession: string) => (
                      <option
                        key={profession}
                        value={profession}
                        style={{ background: "#181B23" }}
                      >
                        {profession}
                      </option>
                    ))}
                  </Select>
                </Box>
              </SimpleGrid>
            </VStack>

            <Flex mt="8" justify="flex-end">
              <HStack spacing="4">
                <Button
                  onClick={() => {
                    router.back();
                  }}
                  cursor="pointer"
                  as="a"
                  colorScheme="whiteAlpha"
                >
                  Cancelar
                </Button>
                <Button
                  isLoading={formState.isSubmitting}
                  onClick={handleSubmit(handleEditUser)}
                  colorScheme="red"
                >
                  Salvar
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
