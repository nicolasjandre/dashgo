import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  VStack,
  Button,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Input } from "../../components/Form/Input";

import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";

import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import styles from "../../styles/styles.module.scss";
import { useMutation } from "react-query";
import { api } from "../../services/axios";
import { queryClient } from "../../services/ReactQueryClient";
import { getSession } from "@auth0/nextjs-auth0";
import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";

interface CreateUser {
  name: string;
  email: string;
  sex: string;
  profession: string;
}

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const createUserFormSchema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório."),

  email: yup
    .string()
    .required("E-mail é obrigatório.")
    .email("Digite um e-mail válido.")
    .matches(emailRegex, "Digite um e-mail válido."),
});

export default function CreateUser() {
  const router = useRouter();

  const createUser = useMutation(
    async (user: CreateUser) => {
      const response = await api.post("users/create", {
        name: user.name.toLowerCase(),
        email: user.email,
        sex: user.sex,
        profession: user.profession,
      });

      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
    }
  );

  const handleCreateUser: SubmitHandler<CreateUser> = async (data) => {
    try {
      await createUser.mutateAsync(data);
    } catch (error: any) {
      if (error?.response?.status === 409) {
        return alert(error?.response?.data);
      }
      return console.error(error?.response?.data);
    }
    alert("Usuário cadastrado com sucesso!");
    router.push("/users");
  };

  const { register, handleSubmit, formState } = useForm<CreateUser>({
    resolver: yupResolver(createUserFormSchema),
  });

  const { errors } = formState;

  return (
    <>
      <NextSeo title="jandash | Criar Usuário" />
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
            <Heading size="lg" fontWeight="normal">
              Criar usuário
            </Heading>

            <Divider my="6" borderColor="gray.700" />

            <VStack spacing="8">
              <SimpleGrid minChildWidth="220px" spacing="8" w="100%">
                <Input
                  {...register("name")}
                  error={errors.name}
                  name="name"
                  type="text"
                  label="Nome completo:"
                />
                <Input
                  {...register("email")}
                  error={errors.email}
                  name="email"
                  type="email"
                  label="E-mail:"
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

                <Input
                  {...register("profession")}
                  name="profession"
                  type="text"
                  label="Profissão:"
                  error={errors.profession}
                />
              </SimpleGrid>
            </VStack>

            <Flex mt="8" justify="flex-end">
              <HStack spacing="4">
                <Button
                  onClick={() => {
                    router.push("/users");
                  }}
                  cursor="pointer"
                  as="a"
                  colorScheme="whiteAlpha"
                >
                  Cancelar
                </Button>
                <Button
                  isLoading={formState.isSubmitting}
                  onClick={handleSubmit(handleCreateUser)}
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
