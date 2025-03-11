import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#a5e1ad", // Light mode background
      paper: "#4ca1a3",   // Light mode component
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#21094e", // Dark mode background
      paper: "#511281",   // Dark mode component
    },
  },
});
