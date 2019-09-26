import { Theme, createStyles } from '@material-ui/core';
import { colors } from 'theme';

const titleHeight = 40;

const styles = (theme: Theme) => createStyles({
  banner: {
    marginBottom: '16px',
    backgroundColor: 'transparent',
    width: '100%'
  },
  maxWidth: {
    width: '1200px!important'
  },
  actionButton: {
    marginTop: '12px',
    marginBottom: '12px'
  },
  emptyRow: {
    height: '71px',
  },
  rowText: {
    fontSize: theme.typography.pxToRem(12),
  },
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
    "& > *":{
      width: 200,
      margin: "0 20px"
    }
  },
  modal: {
    position: 'absolute',
    // width: "",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflow:"hidden",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    "&:before":{
      content: "''",
      display: "block",
      width: "100%",
      height: titleHeight,
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: -1,
      backgroundColor: colors.grey,
    }
  },
  modalTitle: {
    "& h2": {
      fontSize: "16px",
      textTransform: "uppercase",
      textAlign: "left",
      margin: 0,
      padding: 0
    }
  },
  table:{
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "20px 0",
    "& > *":{
      margin: "10px 0",
      padding: 0,
      width: "50%",
      "&:nth-child(even)":{
        textAlign: "right"
      }
    }
  },
  modalContent: {
    margin: "20px 0"
  },
  input:{
    justifyContent: "flex-end",
    width: 150,
  },
  link: {
    textDecoration: 'none',
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
  }
});

export default(styles);
