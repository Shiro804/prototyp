"use client";

import { createTheme, darken, Paper, Title } from "@mantine/core";

export const theme = createTheme({
  components: {
    Title: Title.extend({
      styles: {
        root: {
          marginBottom: "1em",
        },
      },
    }),
    Paper: Paper.extend({
      styles: (prev) => ({
        root: {
          backgroundColor: darken(prev.white, 0.1),
        },
      }),
    }),
  },
});
