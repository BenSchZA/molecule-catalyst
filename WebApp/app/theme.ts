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
    primary: '#37B4A4',
    secondary: '#12999D',
  },
  white: '#FFFFFF',
  black: '#000000',
  grey: '#E5E5E5',
  lightGrey: '#f2f2f2'
}

const theme = (createMuiTheme as any)({
  palette: {
    background: {
      default: colors.grey,
      paper: colors.white,
    },
    primary: {
      main: colors.moleculeBranding.primary
    },
    secondary: {
      main: colors.moleculeBranding.secondary
    },
  },
  typography: {
    fontFamily:  [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Montserrat',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  overrides: {
    MuiButton: {
      root: {
        background: colors.moleculeBranding.primary,
        color: colors.white,
        marginTop: '24px',
        marginLeft: '8px',
        marginBottom: '24px',
      },
      text:{
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingTop: '8px'
      },
    },
    MuiPaper: {
      root: {
        // paddingLeft: '8px',
        // paddingRight: '8px',
      }
    },
    MuiTypography: {
      h1: {
        paddingTop: '32px',
        paddingBottom: '32px',
        textAlign: 'center'
      },
      h2: {
        paddingTop: '64px',
        paddingBottom: '32px',
        textAlign: 'center'
      },
      h4:{
        paddingTop: '8px',
        paddingBottom: '16px',
        paddingLeft: '8px'
      },
      h3:{
        textAlign: 'center',
        paddingTop: '32px',
        paddingBottom: '32px'
      },
      h5: {
        paddingTop: '32px',
        paddingBottom: '16px'
      },
      body1: {
        paddingBottom: '16px',
        paddingLeft: '8px'
      }
    },
    MuiInputLabel:{
      root:{
        fontWeight: 'bold',
        paddingTop: '8px',
        paddingBottom: '2px',
        paddingLeft: '8px'
      }
    },
    MuiTextField:{
      root:{
        marginTop: '8px',
        marginBottom: '8px',
        marginLeft: '8px',
        marginRight: '8px',
        backgroundColor: colors.grey
      }
    },
    MuiFormControl: {
        fullWidth:{
          width: '90%'
        }
      
    },
    MuiFormHelperText:{
      root:{
        backgroundColor: colors.white,
        margin: '0px'
      },
      contained:{
        margin: '0px'
      }
    },
    MuiSvgIcon:{
      root:{
        paddingRight: '4px' 
      }
    },
    MuiContainer:{
      maxWidthXl:{
        width:'1200px'
      }
    },
    MuiTable:{
      root:{

      }
    },
    MuiTableHead:{
      root:{
        backgroundColor: colors.grey
      }
    },
    MuiTableRow: {
      root: {
        height: '4px'
      }
    },
    MuiTableCell:{
      root:{
      },
      body:{
        paddingTop: '4px',
        paddingBottom: '4px',
      },
      head: {
        fontSize: '1rem'
      }
    },
    MuiDivider:{
      root:{
      },
      middle:{
        marginTop: "32px",
        backgroundColor: colors.moleculeBranding.primary,
        alignSelf: 'center',
        verticalAlign: 'middle',
      }
    }
  }
});

export default theme;
