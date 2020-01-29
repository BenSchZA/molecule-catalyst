import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { withStyles, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(theme => ({
  uniswapPanelDetails: {
    display: 'block',
    padding: '0',
  },
  uniswapIframe: {
    border: 0,
    margin: '0 auto',
    display: 'block',
    borderRadiusTopleft: '0px',
    borderRadiusTopRight: '0px',
    borderBottomLeftRadius: '20px',
    borderBottomRightRadius: '20px',
    maxWidth: '600px',
    minWidth: '300px',
  },
  modalText: {
    textAlign: "left",
    fontFamily: "Roboto",
    fontSize: "14px",
    letterSpacing: "0.46px",
    color: "#37B4A4",
    opacity: 1.0,
    textAlignLast: "center",
  },
}));

const ExpansionPanel = withStyles({
  root: {
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: '0 auto',
      paddingTop: "0px",
      paddingBottom: "0px",
    },
    '&$rounded': {
      borderRadius: "20px",
    },
    background: "#002835 0% 0% no-repeat padding-box",
    border: "1px solid #268982",
    borderRadius: "20px",
    opacity: 1.0,
    display: "inline-block",
  },
  expanded: {
    paddingTop: "0px",
    paddingBottom: "0px",
  },
  rounded: {
  },
})(MuiExpansionPanel);
  
const ExpansionPanelSummary = withStyles({
  root: {
    marginBottom: -1,
    minHeight: 0,
    '&$expanded': {
      minHeight: 0,
    },
  },
  content: {
    '&$expanded': {
      margin: '0 auto',
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary);
  
const ExpansionPanelDetails = withStyles(theme => ({
  root: {
  },
}))(MuiExpansionPanelDetails);

export default function UniswapExpansionPanel() {
  const classes = useStyles();

  return (
    <div>
      <ExpansionPanel square={false}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon color="secondary" />}
          aria-controls="panel-content"
          id="panel-header"
        >
          <Typography className={classes.modalText}>
            Easily swap your tokens for Dai with Uniswap.
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.uniswapPanelDetails}>
          <div>
            <iframe
              className={classes.uniswapIframe}
              src="https://uniswap.exchange/swap?theme=light&outputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f"
              height="660px"
              width="100%"
              id="uniswap"
            />
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}