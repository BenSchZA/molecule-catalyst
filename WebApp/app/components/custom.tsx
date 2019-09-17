import { withStyles, Button } from "@material-ui/core";

export const NegativeButton = withStyles({
  root: {
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 1px 3px #00000033',
    borderRadius: '4px',
    textAlign: 'center',
    font: 'Bold 14px/24px Montserrat',
    letterSpacing: '0.18px',
    color: '#003E52',
  },
})(Button);

export const PositiveButton = withStyles({
  root: {
    background: '#03DAC6 0% 0% no-repeat padding-box',
    boxShadow: '0px 1px 3px #00000033',
    borderRadius: '4px',
    textAlign: 'center',
    font: 'Bold 14px/24px Montserrat',
    letterSpacing: '0.18px',
    color: '#FFFFFF'
  }
})(Button);