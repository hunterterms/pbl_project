import { extendTheme } from '@chakra-ui/react';

// UniHub's look: ballpoint-blue ink and highlighter yellow on cool "paper",
// with a poster-style display font for page titles, dates and prices.
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },

  fonts: {
    heading: `'Plus Jakarta Sans', system-ui, sans-serif`,
    body: `'Plus Jakarta Sans', system-ui, sans-serif`,
    display: `'Big Shoulders Display', 'Plus Jakarta Sans', system-ui, sans-serif`,
  },

  colors: {
    // Ballpoint-pen blue, used as colorScheme="brand" on buttons
    brand: {
      50: '#EEF1FE',
      100: '#DCE2FD',
      200: '#B9C4FB',
      300: '#8FA1F6',
      400: '#5F76EC',
      500: '#2C47D9',
      600: '#2338B8',
      700: '#1B2B92',
      800: '#142070',
      900: '#0E1650',
    },
  },

  // Colours that switch automatically between light and dark mode.
  // Use these (e.g. bg="bg.surface", color="fg.muted") instead of fixed shades like gray.600.
  semanticTokens: {
    colors: {
      'bg.canvas': { default: '#F4F5F9', _dark: '#0D1120' },
      'bg.surface': { default: '#FFFFFF', _dark: '#151A2C' },
      'bg.subtle': { default: '#EEF0F6', _dark: '#1C2238' },
      'border.default': { default: '#E2E5EE', _dark: '#262D45' },
      'fg.default': { default: '#172036', _dark: '#E7EAF4' },
      'fg.muted': { default: '#586179', _dark: '#A0A8C0' },
      'fg.accent': { default: 'brand.500', _dark: 'brand.300' },
      // Highlighter yellow: price tags, the active nav link and selected text
      highlight: { default: '#FFE45E', _dark: '#FFE45E' },
      'highlight.fg': { default: '#172036', _dark: '#172036' },
      'highlight.subtle': { default: '#FFE45E', _dark: 'rgba(255, 228, 94, 0.32)' },
    },
  },

  styles: {
    global: {
      body: {
        bg: 'bg.canvas',
        color: 'fg.default',
      },
      '::selection': {
        bg: 'highlight',
        color: 'highlight.fg',
      },
      '@media (prefers-reduced-motion: reduce)': {
        '*, *::before, *::after': {
          animationDuration: '0.01ms !important',
          transitionDuration: '0.01ms !important',
        },
      },
    },
  },

  components: {
    Badge: {
      baseStyle: {
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: 'md',
        px: 2,
        py: 0.5,
      },
    },
    Modal: {
      baseStyle: {
        overlay: { bg: 'blackAlpha.600', backdropFilter: 'blur(2px)' },
        dialog: { bg: 'bg.surface', borderRadius: 'xl' },
      },
    },
    Menu: {
      baseStyle: {
        list: { bg: 'bg.surface', borderColor: 'border.default' },
      },
    },
    Input: { defaultProps: { focusBorderColor: 'brand.400' } },
    Select: { defaultProps: { focusBorderColor: 'brand.400' } },
    Textarea: { defaultProps: { focusBorderColor: 'brand.400' } },
  },
});

export default theme;
