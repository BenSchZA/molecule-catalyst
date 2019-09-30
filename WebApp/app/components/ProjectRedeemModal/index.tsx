import { WithStyles, Modal, Typography, Paper, Divider, Avatar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { Info, Close } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import Blockies from 'react-blockies';
import { PositiveButton, NegativeButton } from '../custom';
import styles from './styles';
import MoleculeSpinner from 'components/MoleculeSpinner';
import DaiIcon from 'components/DaiIcon/Loadable';

interface Props extends WithStyles<typeof styles> {
  modalState: boolean,
  closeModal(): void,
  holdingsValue: number,
  contributionValue: number,
  txInProgress: boolean,
  tokenBalance: number,
  redeemHoldings(): void;
  marketAddress: string;
}

const ProjectRedeemModal: React.FunctionComponent<Props> = ({
  classes,
  modalState,
  closeModal,
  holdingsValue,
  contributionValue,
  txInProgress,
  redeemHoldings,
  marketAddress,
  tokenBalance,
}: Props) => {

  const displayPrecision = 2;
  const valueChange = contributionValue > 0 ?
    Number(((holdingsValue - contributionValue) * 100 / contributionValue)).toFixed(displayPrecision) : 0;

  return (
    <Modal
      open={modalState}
      onClose={closeModal}>
      <Paper square={false} className={classes.modal}>
        <Typography className={classes.modalTitle}>
          Withdraw Project Stake
        </Typography>
        <hr className={classes.divider} />
        <Avatar className={classes.blockie}>
          <Blockies seed={marketAddress || '0x'} size={15} />
        </Avatar>
        <Typography className={classes.tokenBalance}>
          {tokenBalance ? tokenBalance.toFixed(displayPrecision) : 0}
        </Typography>
        <Typography className={classes.modalText}>
          Your current project token balance
        </Typography>
        <hr className={classes.divider} />
        <section className={classes.daiValuesContainer}>
          <div style={{width: '50%'}}>
            <div className={classes.currency}>
              <DaiIcon height={30} />
              <Typography className={classes.daiValues}>
                {contributionValue.toFixed(displayPrecision)}
              </Typography>
            </div>
            <Typography>
              Value of Project Tokens at the Point of Contribution
            </Typography>
          </div>
          <div style={{width: '50%'}}>
            <div className={classes.currency} >
              <DaiIcon height={30} />
              <Typography className={classes.daiValues}>
                {holdingsValue.toFixed(displayPrecision)}
              </Typography>
            </div>
            <Typography>
              Current Value of Project Tokens
            </Typography>
          </div>
        </section>
        <Typography className={classes.assetPerformance}>
          {valueChange} %
        </Typography>
        <Typography className={classes.modalText}>
          Change % since initial contribution
        </Typography>
        <Typography className={classes.modalText}>
          PLEASE NOTE: Due to numerous interactions in the project market (such as: other people contributing to the project, withdrawing their stakes, or the fundraising campaign having ended),
          the value of your project tokens will be subject to change
          according to the price set by the bonding curve.
          <br />
        </Typography>
        <Typography className={classes.modalText}>
          You can keep up to date with the value of your project tokens in the <Link to='/myProjects' className={classes.link}>My Projects</Link> tab
        </Typography>
        <div className={classes.buttons}>
          <NegativeButton onClick={closeModal}>Cancel</NegativeButton>
          <PositiveButton type='submit' disabled={txInProgress} onClick={redeemHoldings}>Withdraw</PositiveButton>
        </div>
        <Link className={classes.link} to="/">
          <Info />
          <span>
            Need more information?
          </span>
        </Link>
        <div className={classes.closeModal} onClick={closeModal} style={{ display: (!txInProgress) ? "block" : "none" }}>
          <Close style={{ padding: '0px' }} />
        </div>
        <div className={classes.overlay} style={{ display: (txInProgress) ? "block" : "none" }}>
          <div className={classes.spinner}>
            <MoleculeSpinner />
          </div>
        </div>
      </Paper>
    </Modal >
  );
};

export default withStyles(styles, { withTheme: true })(ProjectRedeemModal);
