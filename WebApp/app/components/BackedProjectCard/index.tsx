/**
 *
 * BackedProjectCard
 *
 */

import React, { Fragment, useState } from 'react';
import { Theme, createStyles, withStyles, WithStyles, CardContent, Card, CardHeader, Typography, CardActions, Chip, Grid, Button } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import { lighten } from '@material-ui/core/styles';
import { colors } from 'theme';
import { Project } from 'domain/projects/types';
import { forwardTo } from 'utils/history';

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
    chip:{
      float: 'left',
      marginTop: '10px',
    },
    label:{
      font: 'Bold 12px/15px Montserrat',
      fontWeight: 'bolder',
      letterSpacing: '1.07px',
      color: 'black',
      paddingBottom: 8
    },
    largeText:{
      font: '20px/27px Roboto',
      fontWeight: 'normal',
      letterSpacing: '0.62px',
      color: '#00000099',
      paddingBottom: 8
    },
    progress: {
      font: '12px/15px Montserrat',
      letterSpacing: '1.88px',
      color: '#00000099',
      opacity: 1
    },
    metricContainer:{
      paddingLeft: '24px',
    },
    supportProject: {
      background: '#FFFFFF 0% 0% no-repeat padding-box',
      boxShadow: '0px 1px 3px #00000033',
      borderRadius: '4px',
      textAlign: 'center',
      font: 'Bold 14px/24px Montserrat',
      letterSpacing: '0.18px',
      color: '#003E52',
    },
    redeemHoldings: {
      background: '#03DAC6 0% 0% no-repeat padding-box',
      boxShadow: '0px 1px 3px #00000033',
      borderRadius: '4px',
      textAlign: 'center',
      font: 'Bold 14px/24px Montserrat',
      letterSpacing: '0.18px',
      color: '#FFFFFF',
      float: 'right'
    },
    buttonContainer:{
      paddingRight: '16px'
    },
    cardHeader: {
      paddingBottom: '24px'
    }

  });

const BorderLinearProgress = withStyles({
    root: {
      height: 5,
      width: '647px',
      backgroundColor: lighten(colors.moleculeBranding.third, 0.5),
      paddingleft: '0px',
      marginTop: '84px!important',
      marginBottom: '0px!important',
      marginLeft: '0px!important',
      marginRight: '0px!important'
    },
    bar: {
      borderRadius: 20,
      backgroundColor: colors.moleculeBranding.third,
    }
  })(LinearProgress);


interface OwnProps extends WithStyles<typeof styles> {
  project: Project
}

const switchStatus = (status) => {
  switch(status){
      default :
        return 'ONGOING';
  }
};

const BackedProjectCard: React.FunctionComponent<OwnProps> = ({ project, classes }: OwnProps) => {
  const [raised, setRaised] = useState(true);

  return (
    <Fragment>
     <Card
      className={classes.card}
      onClick={() => forwardTo(`project/${project.id}`)}
      onMouseOver={() => setRaised(true)}
      onMouseOut={() => setRaised(false)}
      raised={raised}>
      <CardHeader
        title={project.title}
        subheader={switchStatus(project.status)}
        className={classes.cardHeader}
      />
       <CardContent className={classes.cardContent}>
       <Grid className={classes.metricContainer} container spacing={1}>
       <Grid item xs={3}>
        <Typography className={classes.label}>Price</Typography>
        <Typography className={classes.largeText}>1.2 DAI</Typography><Typography className={classes.progress}>{'(+10.8%)'}</Typography>
        </Grid>
        <Grid item xs={3}>
        <Typography className={classes.label}>Invested</Typography>
        <Typography className={classes.largeText}>500 Tokens </Typography>
        </Grid>
        <Grid item xs={3}>
        <Typography className={classes.label}>Value</Typography>
        <Typography className={classes.largeText}>$ 608.2</Typography><Typography className={classes.progress}>{'(+10.8%)'}</Typography>
        </Grid>
        <Grid item xs={3}>
        <Typography className={classes.label}>Contributed</Typography>
        <Typography className={classes.largeText}>500 DAI</Typography>
        </Grid>
        </Grid>
         <Typography className={classes.percentage}>55%</Typography>
         <Chip color="primary" label={'Funded of $' + project.researchPhases.reduce((projectTotal, phase) => projectTotal += phase.fundingGoal, 0).toLocaleString()} />
      <BorderLinearProgress
        className={classes.margin}
        variant="determinate"
        color="secondary"
        value={50}  />
       
      </CardContent>
      <CardActions>
        <Grid className={classes.buttonContainer} container>
          <Grid item xs={6}>
          <Button className={classes.supportProject} onClick={() => console.log('buy')}>Support Project</Button>
          </Grid>
          <Grid item xs={6}>
          <Button className={classes.redeemHoldings} onClick={() => console.log('sell')}>Redeem Holdings</Button>
          </Grid>
       </Grid>
      </CardActions>
    </Card>
  </Fragment>);
};

export default withStyles(styles, { withTheme: true })(BackedProjectCard);
