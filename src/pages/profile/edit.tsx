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
  FormLabel,
  Select,
} from "@chakra-ui/react";
import professions from "../../utils/professions.json";
import { useRouter } from "next/router";
import { Input } from "../../components/Form/Input";

import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";

import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import styles from "../../styles/styles.module.scss";
import { useMutation, useQueryClient } from "react-query";
import { api } from "../../services/axios";
import { getSession } from "@auth0/nextjs-auth0";
import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import { capitalize } from "../../utils/capitalize";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRealUser } from "../../hooks/useRealUser";

interface EditUser {
  name: string;
  id: string;
  sex: string;
  profession: string;
}

const editUserFormSchema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório."),
  profession: yup.string().required("Profissão é obrigatório."),
});

export default function EditUser() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const auth0User = useUser();

  const { data } = useRealUser(auth0User?.user?.email as string);

  const { register, handleSubmit, formState } = useForm<EditUser>({
    resolver: yupResolver(editUserFormSchema),
  });

  const editUser = useMutation(
    async (user: EditUser) => {
      try {
        const response = await api.patch(`realusers/update`, {
          user: {
            name: capitalize(user?.name),
            sex: user?.sex,
            profession: user?.profession,
            id: data?.user?.id,
          },
        });

        console.log(response);
      } catch (e) {
        console.log(e);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["real_user"]);
      },
    }
  );

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
    router.push("/profile");
  };

  return (
    <>
      <NextSeo title={`Editar | Meu Perfil`} />
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
              <Text as="span" color="red.500" align="center">
                Edite seu perfil
              </Text>
            </Heading>

            <Divider my="6" borderColor="gray.700" />

            <VStack spacing="8">
              <SimpleGrid minChildWidth="220px" spacing="8" w="100%">
                <Input
                  {...register("name")}
                  error={formState?.errors.name}
                  name="name"
                  label="Nome completo:"
                  isRequired
                />
                <Input
                  name="email"
                  type="email"
                  label="E-mail:"
                  value={data?.user?.email || ""}
                  isDisabled
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
