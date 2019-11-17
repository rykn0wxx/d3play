const containerFluid = function() {
  return function({ addUtilities }) {
    addUtilities({
      '.container-fluid': {
        width: '100%',
        'padding-right': '1rem',
        'padding-left': '1rem',
        'margin-right': 'auto',
        'margin-left': 'auto'
      }
    })
  }
}

module.exports = {
  prefix: 'tw-',
  theme: {
    colors: {
      black: '#22292f',
      white: '#FAFBFC',
      primary: '#264fc1',
      secondary: '#6b34d3',
      accent: '#00d4b7',
      error: '#FF5630',
      background: '#18191c',
      light: '#ECF0F1',
      dark: '#050709'
    },
    container: {
      padding: '1rem'
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    },
    flex: {
      '1': '1',
      none: '0 0 auto',
      initial: '0 1 auto',
      auto: '1 1 auto',
      grow: '1 1 100%',
      nogrow: '0 1 auto',
      noshrink: '1 0 auto'
    },
    fontFamily: {
      sans: ['Roboto', 'Ubuntu', '"Segoe UI"', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif']
    },
    extend: {
      maxWidth: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%'
      },
      letterSpacing: {
        extended: '0.01em'
      }
    }
  },
  variants: {},
  plugins: [containerFluid()]
}
