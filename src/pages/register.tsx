import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  VStack,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Input } from "../components/Form/Input";

import { Logo } from "../components/Header/Logo";

import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import styles from "./styles.module.scss";
import { useMutation } from "react-query";
import { api } from "../services/axios-api";
import { queryClient } from "../services/QueryClient";
import { SSRHandlePath } from "../utils/SSRHandlePath";

interface CreateUser {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
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

  password: yup
    .string()
    .required("Senha é obrigatório.")
    .min(6, "A senha precisa ter ao menos 6 caracteres.")
    .matches(/[0-9]/, "A senha precisa ter um número.")
    .matches(/[a-z]/, "A senha precisa ter uma letra minúscula.")
    .matches(/[A-Z]/, "A senha precisa ter uma letra maiúscula."),

  password_confirmation: yup
    .string()
    .oneOf(["", yup.ref("password")], "As senhas precisam ser idênticas."),
});

export default function CreateUser() {
  const router = useRouter();

  const createUser = useMutation(
    async (user: CreateUser) => {
      const response = await api.post("users", {
        user: {
          ...user,
          created_at: new Date(),
        },
      });

      return response.data.user;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
    }
  );

  const { register, handleSubmit, formState } = useForm<CreateUser>({
    resolver: yupResolver(createUserFormSchema),
  });

  const { errors } = formState;

  const handleCreateUser: SubmitHandler<CreateUser> = async (data) => {
    await createUser.mutateAsync(data);

    router.push("/users");
  };

  return (
    <Box>
      <Flex
        justifyContent='center'
        alignItems='center'
        flexDir="column"
        h="100%"
        w="100%"
        my="6"
        maxWidth={1480}
        mx="auto"
        px="6"
      >
        <Logo p='16' />

        <Box
          className={styles.input}
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={["4", "6", "8"]}
          w='95%'
          maxWidth={1480}
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
              <Input
                {...register("password")}
                name="password"
                type="password"
                label="Senha:"
                error={errors.password}
              />
              <Input
                {...register("password_confirmation")}
                name="password_confirmation"
                type="password"
                label="Confirmar senha:"
                error={errors.password_confirmation}
              />
            </SimpleGrid>
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Button
                onClick={() => {
                  router.push("/");
                }}
                cursor="pointer"
                as="a"
                colorScheme="whiteAlpha"
              >
                Voltar
              </Button>
              <Button
                isLoading={formState.isSubmitting}
                onClick={handleSubmit(handleCreateUser)}
                colorScheme="red"
              >
                Criar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

export const getServerSideProps = SSRHandlePath(async (ctx) => {
  return {
    props: {},
  };
});
