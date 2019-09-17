/**
 *
 * ProjectPhaseStatus
 *
 */

import React from 'react';
import { Theme, createStyles, withStyles, WithStyles, Grid, Typography, Chip, LinearProgress, Divider } from '@material-ui/core';
import { colors } from 'theme';
import { lighten } from '@material-ui/core/styles';
import dayjs from 'dayjs';

const styles = ({ spacing, palette}: Theme) =>
  createStyles({
    phaseProgressBar: {
      color: palette.secondary.main,
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
      opacity: 0.39
    },
    progressBar: {
      background: '#03DAC6 0% 0% no-repeat padding-box',
      borderRadius: '50px',
      opacity: 1,
      width: '242px',
      height: '9px'
    },
    projectProgress: {
      paddingTop: spacing(1),
      paddingBottom: spacing(1),
      color: palette.secondary.main,
      font: '44px/54px Montserrat',
      letterSpacing: '-0.39px',
      opacity: 1
    }
  });

  const BorderLinearProgress = withStyles({
    root: {
      height: 9,
      width: '647px',
      backgroundColor: lighten(colors.moleculeBranding.third, 0.5),
      paddingTop: '12px !important',
      marginTop: '12px !important',
      borderRadius: 20
    },
    bar: {
      borderRadius: 20,
      backgroundColor: colors.moleculeBranding.third,
    },
  })(LinearProgress);

interface OwnProps extends WithStyles<typeof styles> {
  phase: {
    index: number,
    title: string,
    fundingGoal: number,
    fundedAmount: number,
    startDate: string,
    duration: number,
    state: number,
    activePhase: number
  }
}

const ProjectPhaseStatus: React.FunctionComponent<OwnProps> = ({classes, phase}: OwnProps) => 
<Grid item xs={12}>
  <Typography className={classes.label}>PHASE 0{phase.index}</Typography>
  <Typography className={classes.largeText}>{phase.title}</Typography>
  <Typography className={classes.label}>FUNDING GOAL</Typography>
  <Typography className={classes.largeText}>{phase.fundingGoal.toLocaleString()} DAI</Typography>
  <Typography className={classes.progress}>{phase.fundedAmount >= phase.fundingGoal ? 'COMPLETED': (phase.state === 0 ? `NOT STARTED` : `${dayjs(phase.startDate).add(phase.duration, 'month').diff(dayjs(), 'day')} DAYS LEFT`)}</Typography>
  <BorderLinearProgress
        variant="determinate"
        color="secondary"
        value={phase.fundedAmount/phase.fundingGoal*100}  />
  <Typography className={classes.projectProgress}>{`${(phase.fundedAmount/phase.fundingGoal)*100} %`}</Typography>
  <Chip className={classes.chip} label={phase.index-1 < phase.activePhase  ? 'RELEASED' : 'NOT RELEASED'}/>
  <br></br>
  <br></br>
  <br></br>
  <Divider></Divider>
</Grid>;

export default withStyles(styles, { withTheme: true })(ProjectPhaseStatus);
