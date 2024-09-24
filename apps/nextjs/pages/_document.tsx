import React from "react";
import { Html, Head, Main, NextScript } from "next/document";
import { ColorModeScript } from "@chakra-ui/react";
import chakraTheme from "./chakra-theme";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <ColorModeScript
          initialColorMode={chakraTheme.config.initialColorMode}
        />
        <Main />

        <NextScript />
      </body>
    </Html>
  );
}
