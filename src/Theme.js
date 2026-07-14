import { createTheme } from '@mantine/core';

export const theme = createTheme({
  fontFamily: 'Heebo, Assistant, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',

  primaryColor: 'indigo',

  primaryShade: 6,

  components: {
    Card: {
      defaultProps: {
        shadow: 'sm',
        radius: 'md',     
        withBorder: true,
      },
    },
    Button: {
      defaultProps: {
        radius: 'md',      
        loaderProps: { type: 'dots' },
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    PasswordInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    Badge: {
      defaultProps: {
        radius: 'sm',
        variant: 'light', 
      },
    },
  },
});