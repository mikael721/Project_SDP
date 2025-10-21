import { createTheme } from "@mantine/core";

// Define the brown theme
const brownTheme = createTheme({
  colors: {
    brown: [
      "#F5F0EB",
      "#EBE0D5",
      "#DCCBBC",
      "#C9B3A0",
      "#B69B83",
      "#A08469",
      "#8C7057",
      "#775C45",
      "#634A36",
      "#503A2A",
    ],
  },
  primaryColor: "brown",
  primaryShade: 2,
  components: {
    AppShell: {
      styles: {
        main: {
          background: "#F5F0EB",
        },
      },
    },
    Header: {
      styles: {
        root: {
          background: "#A08469",
          color: "white",
        },
      },
    },
  },
});

export default brownTheme;
