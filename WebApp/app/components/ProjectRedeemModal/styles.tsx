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
    "& > *":{
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
      textTransform: "uppercase",
      textAlign: "center",
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
