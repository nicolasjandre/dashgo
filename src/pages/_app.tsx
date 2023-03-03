import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../styles/theme";
import { ReactQueryDevtools } from "react-query/devtools";

import { SidebarDrawerProvider } from "../contexts/SidebarDrawerContext";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 2, // 2 minutes
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <UserProvider>
          <ChakraProvider theme={theme}>
            <SidebarDrawerProvider>
              <Component {...pageProps} />
            </SidebarDrawerProvider>
          </ChakraProvider>
          <ReactQueryDevtools />
        </UserProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}
