import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import MainContainer from "@/components/MainContainer";

export const metadata: Metadata = {
  title: "Projektseminar",
  description: "Kp hab Anforderungen noch nicht angeschaut",
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
        <MantineProvider>
          <MainContainer>{children}</MainContainer>
        </MantineProvider>
      </body>
    </html>
  );
}
