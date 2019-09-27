import { WithStyles, Theme, Modal, Typography, Paper, TextField, InputAdornment, Grid, Avatar } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import { Info, Close } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { NegativeButton, PositiveButton } from 'components/custom';
import MoleculeSpinner from 'components/MoleculeSpinner/Loadable';
import DaiIcon from 'components/DaiIcon/Loadable';
import { ethers } from 'ethers';
import { getBlockchainObjects } from 'blockchainResources';
import { IMarket } from "@molecule-protocol/catalyst-contracts";
import useDebounce from './useDebounce';
import Blockies from 'react-blockies';

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
      textTransform: "uppercase",
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
        padding: theme.spacing(0)
      }
    }
  },
  inputAdornment: {
    color: theme.palette.common.white,
    minWidth: 'max-content',
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
    backgroundColor: theme.palette.common.white,
  }
});

interface Props extends WithStyles<typeof styles> {
  modalState: boolean,
  daiBalance: number,
  contributionRate: number,
  txInProgress: boolean,
  marketAddress: string,
  maxResearchContribution: number,
  closeModal(): void,
  supportProject(contributionAmount: number): void;
}

const ProjectSupportModal: React.FunctionComponent<Props> = ({
  classes,
  daiBalance,
  modalState,
  closeModal,
  contributionRate,
  txInProgress,
  supportProject,
  marketAddress,
  maxResearchContribution,
}: Props) => {
  const [contribution, setContribution] = useState(0);
  const [projectTokenAmount, setProjectTokenAmount] = useState(0);

  const debouncedContribution = useDebounce(contribution, 100);

  useEffect(() => {
    if (debouncedContribution) {
      const fetchData = async () => {
        const { signer } = await getBlockchainObjects();
        const market = new ethers.Contract(marketAddress, IMarket, signer);

        const tokenValue = await market.collateralToTokenBuying(
          ethers.utils.parseUnits(`${debouncedContribution}`, 18)
        );
        setProjectTokenAmount(Number(ethers.utils.formatUnits(tokenValue, 18)))
      };
      debouncedContribution > 0 ? fetchData() : setProjectTokenAmount(0);
    }
  }, [debouncedContribution]);

  const displayPrecision = 2;
  const toResearcher = Number((contribution * contributionRate / 100).toFixed(displayPrecision));
  const toIncentivePool = Number((contribution - (contribution * contributionRate / 100)).toFixed(displayPrecision));
  const maxProjectContribution = Math.min(maxResearchContribution / contributionRate * 100, daiBalance);

  const validateContribution = (value: string) => {
    const newValue = parseFloat(value);
    !isNaN(newValue) && setContribution(newValue);
  }

  return (
    <Modal
      open={modalState}
      onClose={closeModal}
      disableBackdropClick={txInProgress}>
      <Paper square={false} className={classes.modal}>
        <div className={classes.modalTitle}>
          <Typography variant="h2">Support Project</Typography>
        </div>
        <DaiIcon />
        <Typography>{daiBalance ? daiBalance.toFixed(displayPrecision) : 0}</Typography>
        <Typography>
          Your Account Balance
        </Typography>
        <TextField
          autoFocus
          error={(daiBalance < contribution) ? true : false}
          helperText={(daiBalance < contribution) && 'You do not have enough DAI'}
          value={contribution}
          onChange={(e) => validateContribution(e.target.value)}
          className={classes.input}
          inputProps={{
            min: 0,
            max: maxProjectContribution,
          }}
          InputProps={{
            endAdornment: <InputAdornment position='end' className={classes.inputAdornment}>DAI</InputAdornment>,
          }} />
        <Typography>
          Enter Contribution Amount
        </Typography>
        <Typography>
          PLEASE NOTE: Your contribution will be split into two portions.
          The first portion will go directly to the project owner.
          The second portion represents your stake in the research project
          and will be added to a communal pool that grows proportionally
          with more project contributions.
        </Typography>
        <Grid container>
          <Grid item xs={6}>
            <div>
              <DaiIcon height={30} />
              <Typography>{toResearcher}</Typography>
            </div>
            <Typography>
              Research Funding
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <DaiIcon height={30} />
            <Typography>
              {toIncentivePool}
            </Typography>
            <Typography>
              Project Stake
            </Typography>
          </Grid>
        </Grid>
        <Typography>
          In return for your contribution, you will receive tokens priced according to the project bonding curve.
          These tokens can always be redeemed for their current value.
        </Typography>
        <Avatar>
          <Blockies seed={marketAddress || '0x'} size={5} />
        </Avatar>
        <Typography>{projectTokenAmount.toFixed(displayPrecision)}</Typography>
        <Typography>Project Tokens</Typography>
        <Typography>You can keep up to date with the value of your project tokens in the <Link to='/myProjects'>My Projects</Link> tab</Typography>
        <div className={classes.buttons}>
          <NegativeButton disabled={txInProgress} onClick={closeModal}>Cancel</NegativeButton>
          <PositiveButton
            disabled={txInProgress || daiBalance < contribution || contribution >= maxProjectContribution}
            onClick={() => supportProject(contribution)}>
            Support Project
          </PositiveButton>
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
    </Modal>
  );
};

export default withStyles(styles, { withTheme: true })(ProjectSupportModal);
