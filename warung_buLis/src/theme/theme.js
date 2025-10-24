import { createTheme } from "@mantine/core";

const warungTheme = createTheme({
  colors: {
    brown: [
      "#E5C9B8",
      "#C9A89A",
      "#B68B7D",
      "#A06E61",
      "#7D5B4E",
      "#5B3A35",
      "#4D302C",
      "#3F2523",
      "#312020",
      "#231C1C",
    ],
  },
  primaryColor: "brown",
  primaryShade: 4,
  components: {
    AppShell: {
      styles: {
        main: {
          background: "#4c2e01ff",
          color: "white",
        },
        header: {
          backgroundColor: "#8C6234",
          color: "white",
        },
      },
    },
    Paper: {
      styles: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.04)", // Background color for Paper
          borderColor: "rgba(255, 255, 255, 0.12)", // Border color for Paper
          color: "white", // Text color
        },
      },
    },
  },
});

export default warungTheme;
