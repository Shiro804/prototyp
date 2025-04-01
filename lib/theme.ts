"use client";

import {
  Accordion,
  Button,
  createTheme,
  darken,
  lighten,
  NumberInput,
  Paper,
  Title,
} from "@mantine/core";

export const BG_COLOR = "rgb(40, 37, 45)";
export const BUTTON_ACTIVE_COLOR = "rgb(209, 212, 255)";
export const PRIMARY = "#4d93ff";
export const SECONDARY = "#81b2ff";
export const PROCESSSTEP_COLOR = "#5300e8";
export const TABLE_HEADER_COLOR = "rgb(113, 119, 221)";
export const PENDING = "#9B59B6";
export const COMPLETED = "#2ECC40";
export const ACTIVE_BUTTON_COLOR = lighten(PRIMARY, 0.9);

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
      defaultProps: { c: "white" },
      styles: () => ({
        root: {
          "--mrt-base-background-color": BG_COLOR,
        },
      }),
    }),
    Accordion: Accordion.extend({
      styles: (prev) => ({
        item: {
          backgroundColor: BG_COLOR,
          border: "1px solid #4d93ff",
          color: "white",
          "&[data-active]": {
            backgroundColor: darken(BG_COLOR, 0.1),
          },
        },
        control: {
          backgroundColor: BG_COLOR,
          color: "white",
          "&[data-active]": {
            backgroundColor: darken(BG_COLOR, 0.1),
          },
        },
        panel: {
          backgroundColor: BG_COLOR,
          color: "white",
          "&[data-active]": {
            backgroundColor: darken(BG_COLOR, 0.1),
          },
        },
      }),
    }),
  },
  colors: {
    primary: [
      PRIMARY,
      SECONDARY,
      BUTTON_ACTIVE_COLOR,
      "#94a8d0",
      "#748dc1",
      "#5f7cb8",
      "#5474b4",
      "#44639f",
      "#39588f",
      "#2d4b81",
    ],
    button: [
      PRIMARY,
      BUTTON_ACTIVE_COLOR,
      BUTTON_ACTIVE_COLOR,
      BUTTON_ACTIVE_COLOR,
      BUTTON_ACTIVE_COLOR,
      BUTTON_ACTIVE_COLOR,
      BUTTON_ACTIVE_COLOR,
      BUTTON_ACTIVE_COLOR,
      BUTTON_ACTIVE_COLOR,
      BUTTON_ACTIVE_COLOR,
    ],
  },
});
