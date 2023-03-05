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
import { SelectComponent } from "../../components/Form/Select";
import { deepEqual } from "../../utils/deepEqual";
import { EditingUsersModal } from "../../components/EditingUsersModal";
import { useState } from "react";

interface User {
  name: string;
  id?: string;
  email?: string;
  sex: string;
  profession: string;
}

interface EditUser extends User {
  user: User;
}

const editUserFormSchema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  profession: yup.string().required("Profissão é obrigatório"),
  sex: yup.string().required("Sexo é obrigatório"),
});

export default function EditUser() {
  const queryClient = useQueryClient();
  const route = useRouter();
  const [isErrorOnEdit, setIsErrorOnEdit] = useState(false);
  const [isEditingUserModalOpen, setIsEditingUserModalOpen] =
    useState<boolean>(false);
  const [isConfirmingEditUser, setIsConfirmingEditUser] = useState(true);
  const [isContentToEditUser, setIsContentToEditUser] =
    useState<EditUser | null>(null);

  const auth0User = useUser();
  const { data } = useRealUser(auth0User?.user?.email as string);

  const { register, handleSubmit, formState } = useForm<EditUser>({
    resolver: yupResolver(editUserFormSchema),
  });

  const oldUser = {
    name: data?.user?.name,
    profession: data?.user?.profession,
    sex: data?.user?.sex,
  };

  function handleOpenEditingUserModal() {
    setIsEditingUserModalOpen(true);
  }

  function handleCloseEditingUserModal() {
    setIsContentToEditUser(null);
    setIsErrorOnEdit(false);
    setIsEditingUserModalOpen(false);
  }

  const handleConfirmEditUser: SubmitHandler<EditUser> = (data) => {
    setIsContentToEditUser(data);
    setIsConfirmingEditUser(true);
    handleOpenEditingUserModal();

    if (deepEqual(data, oldUser)) {
      setIsContentToEditUser(null);
      return;
    }
  };

  const editUser = useMutation(
    async (user: EditUser) => {
      await api.patch(`realusers/update`, {
        user: {
          name: capitalize(user?.name),
          sex: user?.sex,
          profession: user?.profession,
          id: data?.user?.id,
        },
      });
    },
    {
      onError: (e) => {
        setIsErrorOnEdit(true);
        console.log(e);
      },
      onSuccess: () => {
        queryClient.invalidateQueries("real_user");
      },
    }
  );

  const handleEditUser = async (data: EditUser) => {
    try {
      setIsConfirmingEditUser(false);
      await editUser.mutateAsync(data);
    } catch (error: any) {
      return console.error(error?.response?.data);
    }
  };

  return (
    <>
      <NextSeo title={`Editar | Meu Perfil`} />
      <Box>
        <Header />
        <EditingUsersModal
          handleCloseEditingUsersModal={handleCloseEditingUserModal}
          handleEditUser={handleEditUser}
          isConfirmingEditUser={isConfirmingEditUser}
          isEditingUserModalOpen={isEditingUserModalOpen}
          isErrorOnEdit={isErrorOnEdit}
          isLoading={editUser.isLoading}
          setIsConfirmingEditUser={setIsConfirmingEditUser}
          data={isContentToEditUser}
        />

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
                  defaultValue={data?.user?.name}
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
                <SelectComponent
                  {...register("profession")}
                  error={formState?.errors?.profession}
                  name="profession"
                  label="Profissão:"
                  defaultValue={data?.user?.profession}
                >
                  <option style={{ background: "#181B23" }} value="">
                    Selecione
                  </option>
                  {professions.profissoes.map((profession: string) => (
                    <option
                      key={profession}
                      value={profession}
                      style={{ background: "#181B23" }}
                    >
                      {profession}
                    </option>
                  ))}
                </SelectComponent>

                <SelectComponent
                  {...register("sex")}
                  error={formState?.errors?.sex}
                  name="sex"
                  label="Sexo:"
                  defaultValue={data?.user?.sex}
                >
                  <option style={{ background: "#181B23" }} value="">
                    Selecione
                  </option>
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
                </SelectComponent>
              </SimpleGrid>
            </VStack>

            <Flex mt="8" justify="flex-end">
              <HStack spacing="4">
                <Button
                  onClick={() => {
                    route.back();
                  }}
                  cursor="pointer"
                  as="a"
                  colorScheme="whiteAlpha"
                >
                  Cancelar
                </Button>
                <Button
                  isLoading={formState.isSubmitting}
                  onClick={handleSubmit(handleConfirmEditUser)}
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
