import { withStyles, Button } from "@material-ui/core";

export const NegativeButton = withStyles({
  root: {
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    borderRadius: '4px',
    textAlign: 'center',
    font: 'Bold 14px/24px Montserrat',
    letterSpacing: '0.18px',
    color: '#003E52',
    '&:hover': {
      background: '#FFFFFF 0% 0% no-repeat padding-box',
      boxShadow: '2px 5px 2px #0003',
    }
  },
})(Button);

export const PositiveButton = withStyles({
  root: {
    background: '#50FFE6 0% 0% no-repeat padding-box',
    borderRadius: '4px',
    textAlign: 'center',
    font: 'Bold 14px/24px Montserrat',
    letterSpacing: '0.18px',
    color: '#003E52',
    '&:hover': {
      background: '#50FFE6 0% 0% no-repeat padding-box',
      boxShadow: '2px 5px 2px #0003',
    }
  }
})(Button);