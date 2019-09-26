import { WithStyles, Modal, Typography, Paper, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React, { Fragment } from 'react';
import { compose } from 'redux';
import { Info } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { PositiveButton, NegativeButton } from '../custom';
import styles from './styles';
import MoleculeSpinner from 'components/MoleculeSpinner';

interface Props extends WithStyles<typeof styles> {
  modalState: boolean,
  closeModal(): void,
  holdingsValue: number,
  contributionValue: number,
  txInProgress: boolean,
  redeemHoldings(): void;

}

const ProjectRedeemModal: React.FunctionComponent<Props> = ({
  classes,
  modalState,
  closeModal,
  holdingsValue,
  contributionValue,
  txInProgress,
  redeemHoldings,
}: Props) => {

  const displayPrecision = 2;
  const valueChange = contributionValue > 0 ?
    Number(((holdingsValue - contributionValue) * 100 / contributionValue)).toFixed(displayPrecision) : 0;

  return (

    <Modal
      open={modalState}
      onClose={closeModal}>
      <Paper square={false} className={classes.modal}>
        <div className={classes.overlay} style={{ display: (txInProgress) ? "block" : "none" }}>
          <div className={classes.spinner}>
            <MoleculeSpinner />
          </div>
        </div>
        <div className={classes.modalTitle}>
          <Typography variant="h2">Redeem Incentive Pool Holdings</Typography>
        </div>
        <div className={classes.table}>
          <Typography variant="body1">
            Your Incentive Pool Holdings Value:
              </Typography>
          <Typography variant="body1">{holdingsValue.toFixed(displayPrecision)} DAI</Typography>
          <Typography variant="body1">
            Your Incentive Pool Contribution Value:
              </Typography>
          <Typography variant="body1">{contributionValue.toFixed(displayPrecision)} DAI</Typography>
        </div>
        <Divider />
        <div className={classes.table}>
          <Typography variant="body1">
            Change
              </Typography>
          <Typography variant="body1">
            {valueChange} %
          </Typography>
        </div>
        <Link className={classes.link} color="primary" to="/">
          <Fragment>
            <Info />
            <span>
              Read more about our trading technology
                </span>
          </Fragment>
        </Link>
        <div className={classes.buttons}>
          <NegativeButton onClick={closeModal}>Cancel</NegativeButton>
          <PositiveButton type='submit' disabled={txInProgress} onClick={redeemHoldings}>Withdraw</PositiveButton>
        </div>
      </Paper>
    </Modal>
  );
};

const composeWithStyles = withStyles(styles, { withTheme: true });

export default compose(
  composeWithStyles,
)(ProjectRedeemModal);
