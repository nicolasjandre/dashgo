import { Flex, Text, Button } from "@chakra-ui/react";

import { Logo } from "../components/Header/Logo";
import route from "next/router";
import { useUser as useAuth0User } from "@auth0/nextjs-auth0/client";
import { getSession } from "@auth0/nextjs-auth0";
import { GetServerSideProps } from "next";

export default function SignIn() {
  const { isLoading } = useAuth0User();

  return (
    <Flex
      flexDir="column"
      w="100vw"
      h="90vh"
      align="center"
      justify="center"
      p={["4", "6"]}
    >
      <Logo fontSize={["50", "64"]} pb="32" />

      <Text fontSize={["16", "18"]} pb="4">
        Welcome! Login to acess dashboard.
      </Text>

      <Flex
        width="100%"
        maxWidth={360}
        bg="gray.800"
        p={["4", "6"]}
        borderRadius={8}
        flexDir="column"
      >
        <Button
          onClick={() => route.push("/api/auth/login?returnTo=/dashboard")}
          type="submit"
          colorScheme="red"
          size="lg"
          isLoading={isLoading}
        >
          Login
        </Button>
      </Flex>
    </Flex>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const response = await getSession(ctx.req, ctx.res);
  const session = JSON.parse(JSON.stringify(response));

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};