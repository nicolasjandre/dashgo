import { Button, Flex, Link, Stack, Text } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "../components/Form/Input";

import styles from "./styles.module.scss";
import { Logo } from "../components/Header/Logo";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useRouter } from "next/router";

type SignInFormData = {
  email: string;
  password: string;
};

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const signInFormSchema = yup.object().shape({
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
});

export default function SignIn() {
  const router = useRouter()
  const { signIn } = useContext(AuthContext)
  
  const { register, handleSubmit, formState } = useForm<SignInFormData>({
    resolver: yupResolver(signInFormSchema),
  });

  const { errors } = formState;

  const handleSignIn: SubmitHandler<SignInFormData> = async (data) => {
    const response = await signIn(data)
    
    if (response.token) {
      router.push('/dashboard')
    }
  };

  return (
    <Flex
      flexDir="column"
      w="100vw"
      h="80vh"
      align="center"
      justify="center"
      p={["4", "6"]}
    >
      <Logo mb="12" />

      <Flex
        onSubmit={handleSubmit(handleSignIn)}
        as="form"
        width="100%"
        maxWidth={360}
        bg="gray.800"
        p={["4", "6"]}
        borderRadius={8}
        flexDir="column"
      >
        <Stack className={styles.input} spacing="4">
          <Input
            error={errors.email}
            {...register("email")}
            className={styles.input}
            label="E-mail:"
            type="email"
            name="email"
          />
          <Input
            error={errors.password}
            {...register("password")}
            className={styles.input}
            label="Senha:"
            type="password"
            name="password"
          />

          <Button
            isLoading={formState.isSubmitting}
            type="submit"
            colorScheme="red"
            size="lg"
          >
            Entrar
          </Button>

          <Text textAlign="center" fontSize="15">
            Não possui uma conta?{" "}
            <Link
              href="/register"
              cursor="pointer"
              color="red.500"
              display="inline"
            >
              Cadastre-se!
            </Link>
          </Text>
        </Stack>
      </Flex>
    </Flex>
  );
}
