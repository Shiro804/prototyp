import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./global.css";

import MainContainer from "@/components/MainContainer";
import { theme } from "@/lib/theme";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "mantine-react-table/styles.css";

export const metadata: Metadata = {
  title: "Projektseminar",
  description: "Digitaler Zwilling für einen ausgewählten Intralogistikprozess",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <MainContainer>{children}</MainContainer>
        </MantineProvider>
      </body>
    </html>
  );
}
