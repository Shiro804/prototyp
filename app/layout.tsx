import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

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
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
