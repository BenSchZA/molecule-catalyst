/**
 *
 * BackedProjectCard
 *
 */

import React, { Fragment, useState, useEffect } from 'react';
import { Theme, createStyles, withStyles, WithStyles, CardContent, Card, CardHeader, Grid, Button, Typography, Divider } from '@material-ui/core';
import { colors } from 'theme';
import { Project } from 'domain/projects/types';
import { forwardTo } from 'utils/history';
import { ethers } from 'ethers';
import { getBlockchainObjects } from 'blockchainResources';
import { IMarket } from "@molecule-protocol/catalyst-contracts";
import { bigNumberify } from 'ethers/utils';

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
      margin: '6px 0 0 0!important',
      '&:hover': {
        background: '#003E52 0% 0% no-repeat padding-box',
        boxShadow: '2px 5px 2px #0003',
      }
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
      margin: '6px 0 0 0!important',
      '&:hover': {
        background: '#0EBCAC 0% 0% no-repeat padding-box',
        boxShadow: '2px 5px 2px #0003',
      }
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
    dividerHorizontal: {
      margin: '0 0 10px 0',
      padding: 0,
      width: '980px',
      backgroundColor: colors.moleculeBranding.third,
    },
    dividerVertical: {
      margin: 0,
      padding: 0,
      width: '1px',
      height: '90px',
      backgroundColor: colors.moleculeBranding.third,
    },
    dividerVertical2: {
      margin: 0,
      padding: 0,
      width: '1px',
      height: '45px',
      backgroundColor: colors.moleculeBranding.third,
    },
  });


interface OwnProps extends WithStyles<typeof styles> {
  project: Project,
  userAddress: string,
  openModal(): void;
}


const BackedProjectCard: React.FunctionComponent<OwnProps> = ({ project, userAddress, classes, openModal }: OwnProps) => {
  const [raised, setRaised] = useState(true);
  const [holdingsValue, setHoldingsValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { signer } = await getBlockchainObjects();
      const market = new ethers.Contract(project.chainData.marketAddress, IMarket, signer);

      const tokenValue = project.marketData.active ? 
        await market.rewardForBurn(project.marketData.balances?.[userAddress] || 0) : 
        bigNumberify(project.marketData.poolValue).mul(project.marketData.balances?.[userAddress] || 0).div(project.marketData.totalSupply);
      setHoldingsValue(Number(ethers.utils.formatEther(tokenValue)));
    };
    fetchData();

    return () => { }
  }, [project.marketData.tokenPrice]);

  const userHasBalance = userAddress && project?.marketData?.balances?.[userAddress] &&
    Number(Number(ethers.utils.formatEther(project?.marketData?.balances?.[userAddress])).toFixed(8)) > 0;

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
                <Button className={classes.redeemHoldings} onClick={openModal} disabled={!userHasBalance}>Withdraw Stake</Button>
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
              <Divider className={classes.dividerVertical} />
              <Grid item xs>
                <Typography className={classes.label}>Price</Typography>
                <Typography className={classes.labelSmall}>Current price of project token</Typography>
              </Grid>
              <Divider className={classes.dividerVertical} />
              <Grid item xs>
                <Typography className={classes.label}>Tokens</Typography>
                <Typography className={classes.labelSmall}>Number of project tokens you own</Typography>
              </Grid>
              <Divider className={classes.dividerVertical} />
              <Grid item xs>
                <Typography className={classes.label}>Value</Typography>
                <Typography className={classes.labelSmall}>Value of your project stake</Typography>
              </Grid>
              <Divider className={classes.dividerVertical} />
              <Grid item xs>
                <Typography className={classes.label}>Change %</Typography>
                <Typography className={classes.labelSmall}>Change in value since your contribution</Typography>
              </Grid>
            </Grid>
            <Divider className={classes.dividerHorizontal}></Divider>
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
              <Divider className={classes.dividerVertical2} />
              <Grid item xs>
                <Typography className={classes.largeText}>
                  {Number(ethers.utils.formatEther(project?.marketData?.tokenPrice || 0)).toFixed(2)} DAI
                </Typography>
              </Grid>
              <Divider className={classes.dividerVertical2} />
              <Grid item xs>
                <Typography className={classes.largeText}>
                  {Number(ethers.utils.formatEther(project?.marketData?.balances?.[userAddress] || 0)).toFixed(2)}
                </Typography>
              </Grid>
              <Divider className={classes.dividerVertical2} />
              <Grid item xs>
                <Typography className={classes.largeText}>
                  {holdingsValue.toFixed(2)} DAI
                </Typography>
              </Grid>
              <Divider className={classes.dividerVertical2} />
              <Grid item xs>
                <Typography className={classes.largeText}>{
                  (() => {
                    const displayPrecision = 2;
                    
                    const contributionValue = Number(ethers.utils.formatEther(project?.marketData?.netCost?.[userAddress] || 0))
                        * Number(ethers.utils.formatEther(project?.marketData?.balances?.[userAddress] || 0));
                    
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
