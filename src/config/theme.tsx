import {createTheme} from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1f2937',
    },
    secondary: {
      main: '#635BFF',
    },
    background: {
      default: '#F6F9FC',
      paper: '#F8F8F8',
    },
    error: {
      main: '#FF0000',
    },
    text: {
      primary: '#232323',
      secondary: '#919191',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: () => ({
          '&:hover': {
            opacity: 0.5,
          },
        }),
      },
    },
  },
});

export default theme;
