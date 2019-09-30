import { WithStyles, Modal, Typography, Paper, Avatar, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import { Info, Close } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { IMarket } from "@molecule-protocol/catalyst-contracts";
import Blockies from 'react-blockies';
import { PositiveButton, NegativeButton } from '../custom';
import styles from './styles';
import MoleculeSpinner from 'components/MoleculeSpinner';
import DaiIcon from 'components/DaiIcon/Loadable';
import useDebounce from 'utils/useDebounce';
import { getBlockchainObjects } from 'blockchainResources';
import {ethers} from 'ethers';

interface Props extends WithStyles<typeof styles> {
  modalState: boolean,
  closeModal(): void,
  holdingsValue: number,
  contributionValue: number,
  txInProgress: boolean,
  tokenBalance: number,
  redeemHoldings(tokenAmount: number): void;
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
  const [tokenAmount, setTokenAmount] = useState(0);
  const [daiAmount, setDaiAmount] = useState(0);

  const debouncedTokenAmount = useDebounce(tokenAmount, 100);

  useEffect(() => {
    if (debouncedTokenAmount) {
      const fetchData = async () => {
        const { signer } = await getBlockchainObjects();
        const market = new ethers.Contract(marketAddress, IMarket, signer);

        const tokenValue = await market.rewardForBurn(
          ethers.utils.parseUnits(`${debouncedTokenAmount}`, 18)
        );
        setDaiAmount(Number(ethers.utils.formatUnits(tokenValue, 18)))
      };
      debouncedTokenAmount > 0 ? fetchData() : setDaiAmount(0);
    }
  }, [debouncedTokenAmount]);

  const validateContribution = (value: string) => {
    const newValue = parseFloat(value);
    !isNaN(newValue) && setTokenAmount(newValue);
  }
  const displayPrecision = 2;
  const valueChange = contributionValue > 0 ?
    Number(((holdingsValue - contributionValue) * 100 / contributionValue)).toFixed(displayPrecision) : 0;

  const resetModalState = () => {
    setTokenAmount(0);
    setDaiAmount(0);
    closeModal();
  }

  return (
    <Modal
      open={modalState}
      onClose={resetModalState}>
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
        <TextField
          autoFocus
          error={(tokenBalance < tokenAmount) ? true : false}
          helperText={(tokenBalance < tokenAmount) && `You only have ${tokenBalance} tokens to redeem`}
          value={tokenAmount}
          onChange={(e) => validateContribution(e.target.value)}
          className={classes.input}
          inputProps={{
            min: 0,
            max: tokenBalance,
          }} />
        <Typography className={classes.modalText}>
          Enter the Number of tokens you want to return
        </Typography>
        <hr className={classes.divider} />
        <section className={classes.daiValuesContainer}>
          <div style={{ width: '50%' }}>
            <div className={classes.currency}>
              <DaiIcon height={30} />
              <Typography className={classes.daiValues}>
                {(contributionValue*tokenAmount/tokenBalance).toFixed(displayPrecision)}
              </Typography>
            </div>
            <Typography>
              Value of Project Tokens at the Point of Contribution
            </Typography>
          </div>
          <hr className={classes.verticalDivider} />
          <div style={{ width: '50%' }}>
            <div className={classes.currency} >
              <DaiIcon height={30} />
              <Typography className={classes.daiValues}>
                {daiAmount.toFixed(displayPrecision)}
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
        <hr className={classes.divider} />
        <Typography className={classes.modalText}>
          PLEASE NOTE: Due to numerous interactions in the project market (such as: other people contributing to the project, withdrawing their stakes, or the fundraising campaign having ended),
          the value of your project tokens will be subject to change
          according to the price set by the bonding curve.
        </Typography>
        <hr className={classes.divider} />
        <Typography className={classes.modalText}>
          You can keep up to date with the value of your project tokens in the <Link to='/myProjects' className={classes.link}>My Projects</Link> tab
        </Typography>
        <div className={classes.buttons}>
          <NegativeButton onClick={resetModalState}>Cancel</NegativeButton>
          <PositiveButton type='submit' disabled={txInProgress} onClick={() => redeemHoldings(tokenAmount)}>Withdraw</PositiveButton>
        </div>
        <div className={classes.moreInfo}>
          <Link className={classes.link} to="/">
            <Info />
            <span>
              Need more information?
          </span>
          </Link>
        </div>
        <div className={classes.closeModal} onClick={resetModalState} style={{ display: (!txInProgress) ? "block" : "none" }}>
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
