import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
// import SFProRegular from './fonts/SFProDisplay.woff2';

// const SFProDisplayFont = {
//   fontFamily: 'SFProDisplay',
//   fontStyle: 'normal',
//   fontDisplay: 'swap',
//   src: `
//     local('SFProDisplay'),
//     local('SFProDisplay-Regular'),
//     url(${SFProRegular}) format('woff2')
//   `,
//   unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
// };

export const colors = {
  moleculeBranding:{
    primary: '#01B6BD',
    secondary: '#12999D',
  },
  white: '#FFFFFF',
  black: '#000000',
}

const theme = createMuiTheme({
  palette: {
    background: {
      default:'#E5E5E5',
      paper: '#FFFFFF',
    },
    primary: {
      main: colors.moleculeBranding.primary
    },
    secondary: {
      main: colors.moleculeBranding.secondary
    },
  },
  typography: {
    fontFamily: '\'Montserrat\'',
  },
  overrides: {
    MuiButton: {
      root: {
        background: colors.moleculeBranding.primary,
        color: colors.white,
      }
    }
  }
});

export default theme;
