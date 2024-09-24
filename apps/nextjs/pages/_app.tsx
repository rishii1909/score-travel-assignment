import { IntlProvider } from "@ory/elements";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import "../styles/global.css";
import { useRedirectIfUnauthenticated } from "../hooks/auth";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <IntlProvider>
        <div className="flex flex-col space-x-2 space-y-4 h-svh w-full justify-center items-center">
          <Component {...pageProps} />
        </div>
      </IntlProvider>
    </ChakraProvider>
  );
}
