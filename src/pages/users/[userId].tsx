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
  } from "@chakra-ui/react";
  import { useRouter } from "next/router";
  import { Input } from "../../components/Form/Input";
  
  import { Header } from "../../components/Header";
  import { Sidebar } from "../../components/Sidebar";
  
  import { SubmitHandler, useForm } from "react-hook-form";
  import * as yup from "yup";
  import { yupResolver } from "@hookform/resolvers/yup";
  
  import styles from "../styles.module.scss";
  import { useMutation } from "react-query";
  import { api } from "../../services/axios-api";
  import { queryClient } from "../../services/QueryClient";
  import { SSRHandlePath } from "../../utils/SSRHandlePath";
  import { useUser } from "../../services/hooks/useUsers";
  import { RxUpdate } from "react-icons/rx";
  
  interface EditUser {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
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
  
  export default function EditUser() {
    const router = useRouter();
    const userId = Number(router.query.userId);
  
    const { user, response } = useUser(userId);
  
    const editUser = useMutation(
      async (user: EditUser) => {
        const response = await api.patch(`users/${userId}`, {
          user: {
            ...user,
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
  
    const { register, handleSubmit, formState } = useForm<EditUser>({
      resolver: yupResolver(editUserFormSchema),
    });
  
    const { errors } = formState;
  
    const handleEditUser: SubmitHandler<EditUser> = async (data) => {
      await editUser.mutateAsync(data);
  
      router.push("/users");
    };
  
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
              <Text as="span" color="red.500">
                <Text as="span" color="white">
                  Usuário:{" "}
                </Text>
                {user?.name}
                {response.isFetching && (
                  <Spinner color="gray.500" ml="4" size="sm" />
                )}
              </Text>
  
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
                  label="Novo e-mail:"
                />
              </SimpleGrid>
  
              <SimpleGrid minChildWidth="220px" spacing="8" w="100%">
                <Input
                  {...register("password")}
                  name="password"
                  type="password"
                  label="Nova senha:"
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
    );
  }
  
  export const getServerSideProps = SSRHandlePath(async (ctx) => {
    return {
      props: {},
    };
  });
  