import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../styles/theme";
import { ReactQueryDevtools } from "react-query/devtools";

import { SidebarDrawerProvider } from "../contexts/SidebarDrawerContext";
import { makeServer } from "../services/mirage";
import { QueryClientProvider } from "react-query";
import { queryClient } from "../services/QueryClient";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { AuthProvider } from "../contexts/AuthContext";

if (process.env.NODE_ENV === "development") {
  makeServer();
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <SidebarDrawerProvider>
              <Component {...pageProps} />
            </SidebarDrawerProvider>
          </ChakraProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </AuthProvider>
    </UserProvider>
  );
}