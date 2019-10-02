/**
 *
 * BackedProjectCard
 *
 */

import React, { Fragment, useState } from 'react';
import { Theme, createStyles, withStyles, WithStyles, CardContent, Card, CardHeader, Grid, Button, Typography } from '@material-ui/core';
import { colors } from 'theme';
import { Project } from 'domain/projects/types';
import { forwardTo } from 'utils/history';
import { ethers } from 'ethers';

const styles = (theme: Theme) =>
  createStyles({
    percentage: {
      color: '#37B4A4',
      fontWeight: 'lighter',
      fontSize: '60px',
      float: 'left',
      paddingTop: '0px',
      marginTop: '12px',
      paddingBottom: '15px',
      paddingLeft: '16px'
    },
    margin: {
      margin: theme.spacing(1),
    },
    card: {
      cursor: 'pointer',
      width: '1020px',
      height: '268px'
    },
    cardImage: {
      paddingTop: 36,
      height: 280
    },
    avatar: {
      float: 'right',
      paddingTop: '8px',
      paddingBottom: '8px',
      paddingLeft: '30%'
    },
    cardContent: {
      fontSize: '0.9rem',
      fontWeight: 'normal',
      color: colors.darkGrey,
      height: '250px',
      paddingLeft: '0px',
      paddingTop: '50px',
      fontFamily: 'Roboto',
      padding: '0px'
    },
    chip: {
      float: 'left',
      marginTop: '10px',
    },
    label: {
      textAlign: 'left',
      font: 'Bold 18px/24px Montserrat',
      letterSpacing: 0,
      color: '#000000DE',
      paddingBottom: 8
    },
    labelSmall: {
      textAlign: 'left',
      font: '14px/18px Roboto',
      letterSpacing: '0.46px',
      color: '#00000099',
      paddingBottom: 8
    },
    largeText: {
      textAlign: 'left',
      font: '25px/30px Montserrat',
      fontWeight: 'lighter',
      letterSpacing: '-0.22px',
      color: '#003E52',
      paddingBottom: 4
    },
    metricContainer: {
      paddingLeft: '24px',
      flexGrow: 1,
    },
    supportProject: {
      background: '#003E52 0% 0% no-repeat padding-box',
      boxShadow: '0px 1px 3px #00000033',
      borderRadius: '4px',
      textAlign: 'center',
      font: 'Bold 14px/24px Montserrat',
      letterSpacing: '0.18px',
      color: '#FFFFFF',
      width: '170px',
      height: '39px',
      margin: '6px 0 0 0!important'
    },
    redeemHoldings: {
      borderRadius: '4px',
      textAlign: 'center',
      font: 'Bold 14px/24px Montserrat',
      background: '#0EBCAC 0% 0% no-repeat padding-box',
      boxShadow: '0px 1px 3px #00000033',
      letterSpacing: '0.18px',
      color: '#FFFFFF',
      float: 'right',
      width: '170px',
      height: '39px',
      margin: '6px 0 0 0!important'
    },
    buttonContainer: {
      paddingRight: '16px',
      float: 'right',
      width: '380px',
      margin: 0
    },
    cardHeaderTitle: {
      paddingBottom: '24px',
      textAlign: 'left',
      font: '25px/30px Montserrat',
      letterSpacing: '-0.22px',
      color: '#000000DE',
      opacity: 1,
      width: '558px',
    },
    cardHeader: {
      padding: '20px'
    },

  });


interface OwnProps extends WithStyles<typeof styles> {
  project: Project,
  userAddress: string,
}


const BackedProjectCard: React.FunctionComponent<OwnProps> = ({ project, userAddress, classes }: OwnProps) => {
  const [raised, setRaised] = useState(true);

  return (
    <Fragment>
      <Card
        className={classes.card}
        onMouseOver={() => setRaised(true)}
        onMouseOut={() => setRaised(false)}
        raised={raised}>
        <CardHeader
          title={project.title}
          classes={{
            title: classes.cardHeaderTitle,
            root: classes.cardHeader
          }}
          action={
            <Grid className={classes.buttonContainer} container>
              <Grid item xs={6}>
                <Button className={classes.supportProject} onClick={() => forwardTo(`project/${project.id}`)}>View Project</Button>
              </Grid>
              <Grid item xs={6}>
                <Button className={classes.redeemHoldings} onClick={() => forwardTo(`project/${project.id}`)}>Withdraw Stake</Button>
              </Grid>
            </Grid>
          }
        />

        <CardContent className={classes.cardContent}>
          <Grid className={classes.metricContainer} container spacing={1}>
            <Grid container spacing={2}>
              <Grid item xs>
                <Typography className={classes.label}>Funding Progress</Typography>
                <Typography className={classes.labelSmall}>Progress of entire project including all phases</Typography>
              </Grid>
              <Grid item xs>
                <Typography className={classes.label}>Price</Typography>
                <Typography className={classes.labelSmall}>Current price of project token (in DAI)</Typography>
              </Grid>
              <Grid item xs>
                <Typography className={classes.label}>Tokens</Typography>
                <Typography className={classes.labelSmall}>Amount of project tokens you own</Typography>
              </Grid>
              <Grid item xs>
                <Typography className={classes.label}>Value</Typography>
                <Typography className={classes.labelSmall}>Value of project token (in DAI)</Typography>
              </Grid>
              <Grid item xs>
                <Typography className={classes.label}>Change %</Typography>
                <Typography className={classes.labelSmall}>Change since initial contribution</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs>
                <Typography className={classes.largeText}>{
                  (() => {
                    const totalRaised = Number(ethers.utils.formatEther(project.vaultData.totalRaised));
                    const totalFundingGoal = project.vaultData.phases.reduce((total, phase) =>
                      total += Number(ethers.utils.formatEther(phase.fundingThreshold)), 0);
                    return totalRaised >= totalFundingGoal ? 100 : Math.ceil(totalRaised / totalFundingGoal * 100);
                  })()
                } %</Typography>
              </Grid>
              <Grid item xs>
                <Typography className={classes.largeText}>
                  {(project.chainData && project.chainData.marketData) ? 
                    Number(ethers.utils.formatUnits(project.chainData.marketData.tokenPrice, 18)).toFixed(2) : 
                    ''
                  } DAI
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography className={classes.largeText}>
                  {Number(ethers.utils.formatEther(project.marketData.balances[userAddress])).toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography className={classes.largeText}>
                  {(project.chainData && project.chainData.marketData) ? Number(ethers.utils.formatEther(project.chainData.marketData.holdingsValue)) : 0} DAI
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography className={classes.largeText}>{
                  (() => {
                    const displayPrecision = 2;
                    const contributionValue =
                      userAddress &&
                        project &&
                        project.marketData &&
                        project.marketData.netCost &&
                        project.marketData.netCost[userAddress]
                        ? Number(ethers.utils.formatEther(project.marketData.netCost[userAddress]))
                        * Number(ethers.utils.formatEther(project.marketData.balances[userAddress])) : 0;
                    project &&
                      project.marketData &&
                      project.marketData.netCost &&
                      project.marketData.netCost[userAddress]
                      ? Number(ethers.utils.formatEther(project.marketData.netCost[userAddress]))
                      * Number(ethers.utils.formatEther(project.marketData.balances[userAddress])) : 0;

                    const holdingsValue = project && project.chainData && project.chainData.marketData
                      ? Number(ethers.utils.formatEther(project.chainData.marketData.holdingsValue)) : 0;


                    return contributionValue > 0 ?
                      Number(((holdingsValue - contributionValue) * 100 / contributionValue)).toFixed(displayPrecision) : 0;

                  })()
                } %</Typography>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Fragment>);
};

export default withStyles(styles, { withTheme: true })(BackedProjectCard);
