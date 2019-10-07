import { createStyles, Theme } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
  buttons: {
    paddingTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center',
    "& > *": {
      width: 200,
      margin: "0 20px"
    }
  },
  modal: {
    position: 'absolute',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '534px',
    boxShadow: '20px 20px 60px #00000071',
    border: '2px solid #FFFFFF',
    borderRadius: '10px',
    opacity: 1,
    textAlign: 'center',
  },
  closeModal: {
    position: 'absolute',
    top: 0,
    left: '100%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.main,
    borderRadius: '50%',
    padding: '3px',
    cursor: 'pointer',
  },
  modalTitle: {
    "& h2": {
      fontSize: "30px",
      textAlign: "center",
      margin: 0,
      padding: 0
    }
  },
  table: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "20px 0",
    "& > *": {
      margin: "10px 0",
      padding: 0,
      width: "50%",
      "&:nth-child(even)": {
        textAlign: "right"
      }
    }
  },
  input: {
    width: 170,
    marginTop: theme.spacing(2),
    padding: 0,
    background: '#00212CBC 0% 0% no-repeat padding-box',
    border: '1px solid #FFFFFF',
    borderRadius: '2px',
    '& > *': {
      color: theme.palette.common.white,
      padding: theme.spacing(1, 1),
      '& > *': {
        padding: theme.spacing(0),
        '&:-webkit-inner-spin-button': { 
          WebkitAppearance: 'none',
          margin: 0,
        }, 
        '&:-webkit-outer-spin-button': { 
          WebkitAppearance: 'none',
          margin: 0,
        },
      }
    },
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0
    }
  },
  inputAdornment: {
    color: theme.palette.common.white,
    minWidth: 'max-content',
    '& > *': {
      color: theme.palette.common.white,
    }
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.secondary.main,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    borderRadius: '10px',
  },
  spinner: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  divider: {
    width: '259px',
    color: theme.palette.common.white,
    marginTop: '12px',
    marginBottom: '42px',
  },
  verticalDivider: {
    width: '1px',
    color: theme.palette.common.white,
    height: '59px'
  },
  blockie: {
    margin: 'auto',
    width: '30px',
    height: '30px',
    marginRight: theme.spacing(1),
  },
  daiBalance: {
    fontSize: '40px',
    cursor: 'pointer',
  },
  daiValues: {
    fontSize: '30px',
  },
  fundingSplit:{
    display:"flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    margin: "15px auto"
  },
  currency:{
    display: "inline-flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  modalText: {
    fontSize: '14px',
    fontFamily: 'Roboto',
    letterSpacing: '0.46px',
  },
  projectTokens: {
    margin: "15px auto"
  },
  moreInfo: {
    marginTop: '15px',
  },
});

export default (styles);
