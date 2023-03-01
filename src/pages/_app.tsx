import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../styles/theme";
import { ReactQueryDevtools } from "react-query/devtools";

import { SidebarDrawerProvider } from "../contexts/SidebarDrawerContext";
import { QueryClientProvider } from "react-query";
import { queryClient } from "../services/ReactQueryClient";
import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <SidebarDrawerProvider>
              <Component {...pageProps} />
            </SidebarDrawerProvider>
          </ChakraProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
    </UserProvider>
  );
}