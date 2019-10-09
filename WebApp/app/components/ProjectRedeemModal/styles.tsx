import { Theme, createStyles } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
  layout: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
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
  modalSurface: {
    width: '534px',
    // overflowX: 'hidden',
    overflow: 'visible',
  },
  modal: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: theme.spacing(2, 4, 3),
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
    fontSize: "30px",
    textAlign: "center",
    margin: 0,
    padding: 0
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
        padding: theme.spacing(0)
      }
    },
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0
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
    zIndex: 3,
  },
  spinner: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  blockie: {
    margin: 'auto',
    width: '57px',
    height: '57px',
  },
  assetPerformance: {
    fontSize: '40px',
    color: theme.palette.secondary.main
  },
  tokenBalance: {
    fontSize: '40px',
    cursor: 'pointer',
  },
  daiValues: {
    fontSize: '30px',
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
    height: '59px',
    margin: 0,
  },
  daiValuesContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    margin: "15px auto"
  },
  currency: {
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
  moreInfo: {
    marginTop: '15px',
  },
  inputAdornment: {
    color: theme.palette.common.white,
    minWidth: 'max-content',
    '& > *': {
      color: theme.palette.common.white,
    }
  },
});

export default (styles);
