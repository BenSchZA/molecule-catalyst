import { WithStyles, Button, Theme, Modal, Typography, Paper, Divider } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import React, { Fragment } from 'react';
import { compose } from 'redux';
import { Info, ArrowForward } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { colors } from 'theme';
import { Field, Form, FormikProps, FormikValues } from 'formik';
import { TextField } from 'formik-material-ui';

const titleHeight = 40;

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
    "& h2":{
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
  input:{
    justifyContent: "flex-end",
    width: 150,
  },
  link:{
  },
  body1: {
    fontWeight: 'bold',
    color: colors.textBlack,
    paddingBottom: '16px',
    paddingLeft: '8px',
    paddingRight: '8px'
  }
});

interface Props extends WithStyles<typeof styles> {
  modalState: boolean,
  closeModal(): void,
  daiBalance: number,
  contributionRate: number,
  formikProps: FormikProps<FormikValues>,
}

const ProjectSupportModal: React.FunctionComponent<Props> = ({
    classes, 
    daiBalance, 
    modalState, 
    closeModal,
    contributionRate,
    formikProps,
  }: Props) => {

  const displayPrecision = 4;
  const toResearcher = Number((formikProps.values.contribution * contributionRate/100).toFixed(displayPrecision));
  const toIncentivePool = Number((formikProps.values.contribution -  formikProps.values.contribution*contributionRate/100).toFixed(displayPrecision));

  return (
    <Fragment>
      <Form>
        <Modal
          open={modalState}
          onClose={closeModal}
        >
          <Paper square={false} className={classes.modal}>
            <div className={classes.modalTitle}>
              <Typography variant="h2">Support Project</Typography>
            </div>
            <div className={classes.table}>
              <Typography variant="body1">
                Your Account Balance:
              </Typography>
              <Typography variant="body1">{daiBalance ? daiBalance : 0} DAI</Typography>
              <Typography variant="body1">
                Enter Contribution Amount
              </Typography>
              <Field 
                className={classes.input}
                name="contribution"
                type="number" 
                placeholder="DAI"
                component={TextField}
                InputProps={{
                  inputProps: {
                    min: 0,
                  },
                }}
              />
              {/* <ErrorMessage className={classes.input} name="contribution" /> */}
            </div>
            <Divider />
            <div className={classes.table}>
              <Typography variant="body1">
                To Researcher:
              </Typography>
              <Typography variant="body1">
                {toResearcher} DAI
              </Typography>
              <Typography variant="body1">
                To Incentive Pool:
              </Typography>
              <Typography variant="body1">
                {toIncentivePool} DAI
              </Typography>
            </div>
            <Link className={classes.link} color="primary" to="/">
              <Fragment>
                <Info />
                <span>
                  Read more about our trading technology
                </span>
                <ArrowForward />
              </Fragment>
            </Link>
            <div className={classes.buttons}>
              <Button type='submit' disabled={formikProps.isSubmitting} onClick={formikProps.submitForm}>Support Project</Button>
              <Button onClick={closeModal}>Cancel</Button>
            </div>
          </Paper>
        </Modal>
      </Form>
    </Fragment>
  );
};

const composeWithStyles = withStyles(styles, { withTheme: true });

export default compose(
  composeWithStyles,
)(ProjectSupportModal);
