import { createTheme } from "@mui/material";

export const APP_THEME = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#C8E6E6',
      light: '#D6E8EE',
      dark: '#2D6A6A',
    },
    secondary: {
      main: '#f50057',
    },
  },
  cssVariables: true
});
