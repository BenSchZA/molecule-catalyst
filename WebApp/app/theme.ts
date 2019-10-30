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
  moleculeBranding: {
    primary: '#003E52',
    secondary: '#50FFE6',
    primaryLight: '#37B4A4',
    third: '#03DAC6'
  },
  white: '#FFFFFF',
  whiteAlt: '#F7F7F7',
  black: '#000000',
  grey: '#E5E5E5',
  darkGrey: '#3C2828',
  lightGrey: '#f2f2f2',
  textBlack: 'rgba(0, 0, 0, 0.87)',
  textGrey: 'rgba(0, 0, 0, 0.60)'
}

const theme = (createMuiTheme as any)({
  palette: {
    primary: {
      main: colors.moleculeBranding.primary,
    },
    secondary: {
      main: colors.moleculeBranding.secondary,
      dark: colors.moleculeBranding.primaryLight
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1366,
      xl: 1600,
    }
  },
  typography: {
    fontFamily: [
      'Montserrat',
      'Roboto'
    ].join(','),
  },
  overrides: {
    MuiButton: {
      root: {
        background: colors.moleculeBranding.primaryLight,
        color: colors.white,
        marginTop: '24px',
        marginLeft: '8px',
        marginBottom: '24px',
      },
      text: {
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingTop: '8px'
      },
      contained: {
        backgroundColor: colors.moleculeBranding.secondary,
        color: colors.white,
        marginLeft: '44%'
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
        textAlign: 'center',
        fontWeight: 'bold',
      },
      h3: {
        textAlign: 'center',
        paddingTop: '32px',
        paddingBottom: '32px'
      },
      h4: {
        paddingTop: '8px',
        paddingBottom: '16px',
        paddingLeft: '8px',
        paddingRight: '8px'
      },
      h5: {
        paddingTop: '32px',
        paddingBottom: '16px'
      },
    },
    MuiFormLabel: {
      root: {
        color: colors.textBlack
      }
    },
    MuiInputLabel: {
      root: {
        fontWeight: 'bold',
        paddingTop: '8px',
        paddingBottom: '2px',
        paddingLeft: '8px',
        paddingRight: '8px'
      },
      shrink: {
        color: colors.textGrey,
        paddingTop: '8px',
        paddingBottom: '2px',
        paddingLeft: '8px',
        paddingRight: '8px',
        transform: 'scale(0.75)'
      }
    },
    MuiInputBase: {
      input: {
        lineHeight: '1rem',
        fontFamily: 'Roboto',
        fontSize: '20px',
      },
      inputAdornedEnd :{
        lineHeight: '1rem',
        fontFamily: 'Roboto',
        fontSize: '20px',
        paddingTop: 0
      }
    },
    MuiFilledInput: {
      root: {
        backgroundColor: '#ececec',
      },
      multiline: {
        padding: '0px!important',
      },
      inputMarginDense: {
        padding: '8px!important',
      },
      underline: {
        '&:before': {
          borderBottom: '0px'
        },
      }
    },
    MuiTextField: {
      root: {
        marginTop: '8px',
        marginBottom: '8px',
        marginLeft: '8px',
        marginRight: '8px',
        backgroundColor: colors.grey,

      }
    },
    MuiFormControl: {
      fullWidth: {
        width: 'auto',
        display: 'block'
      }
    },
    MuiFormHelperText: {
      root: {
        backgroundColor: colors.white,
        margin: '0px'
      },
      contained: {
        margin: '0px'
      }
    },
    MuiSvgIcon: {
      root: {
        paddingRight: '4px'
      }
    },
    MuiContainer: {
      maxWidthXl: {
        width: '1200px'
      },
      
    },
    MuiTableHead: {
      root: {
        backgroundColor: colors.grey
      }
    },
    MuiTableRow: {
      root: {
        height: '4px'
      }
    },
    MuiTableCell: {
      root: {
      },
      body: {
        paddingTop: '4px',
        paddingBottom: '4px',
      },
      head: {
        fontSize: '1rem'
      }
    },
    MuiDivider: {
      middle: {
        margin: "32px auto 10px !important",
        backgroundColor: colors.moleculeBranding.third,
        alignSelf: 'center',
        verticalAlign: 'middle',
        height: 2,
        width: 1200
      }
    },
    MuiSelect: {
      selectMenu: {
        height: 20,
      }
    },
    MuiCard: {
      root: {
        maxHeight: 712.02
      },
    },
    MuiCardMedia: {
      root: {
        height: '150px',
        paddingLeft: '0px'
      },
    },
    MuiCardHeader: {
      root:{
        height: '84px',
      },
      content: {
        height:'51px'
      },
      title: {
        paddingTop: '0px',
        paddingLeft: '0px',
        paddingBottom: '0px',
        fontSize: '24px',
        fontWeight: 'bold',
        
      },
      subheader: {
        paddingTop: '0px',
        paddingLeft: '0px',
        paddingBottom: '0px',
        fontSize: '12px',
        fontWeight: 'bold',
        fontFamily: 'Montserrat',
        color: colors.darkGrey
      },
    },
    MuiCardActions: {
      root: {
        paddingLeft: '16px'
      }
    },
    MuiChip: {
      root: {
        float: 'right',
        marginTop: '63px',
      },
      colorPrimary: {
        backgroundColor: colors.white,
        color: colors.black,
      },
      label: {
        fontSize: '14px',
        fontWeight: '600',
      }
    },
    MuiTooltip: {
      tooltip: {
        fontSize: "1em",
      }
    }
  }
});

export default theme;
