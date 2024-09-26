"use client";

import { createTheme, Title } from "@mantine/core";

export const theme = createTheme({
  components: {
    Title: Title.extend({
      styles: {
        root: {
          marginBottom: "1em",
        },
      },
    }),
  },
});
