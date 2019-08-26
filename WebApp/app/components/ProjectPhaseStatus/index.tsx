/**
 *
 * ProjectPhaseStatus
 *
 */

import React from 'react';
import { Theme, createStyles, withStyles, WithStyles, Grid, Typography, Chip, LinearProgress } from '@material-ui/core';

const styles = ({palette}: Theme) =>
  createStyles({
    phaseProgressBar: {
      color: palette.secondary.main,
    }
  });

interface OwnProps extends WithStyles<typeof styles> {
  phase: {
    index: number,
    title: string,
    fundingGoal: number,
    fundedAmount: number,
    daysRemaining: number,
    status: string,
  }
}

const ProjectPhaseStatus: React.FunctionComponent<OwnProps> = ({classes, phase}: OwnProps) => 
<Grid item xs={3}>
  <Typography>PHASE {phase.index}</Typography>
  <Typography>{phase.title}</Typography>
  <Typography>FUNDING GOAL</Typography>
  <Typography>{phase.title}</Typography>
  <Typography>FUNDING GOAL</Typography>
  <LinearProgress variant="determinate" value={((phase.fundingGoal-phase.fundedAmount)/phase.fundingGoal)*100} color="secondary"/>
  <Typography>{`${((phase.fundingGoal-phase.fundedAmount)/phase.fundingGoal)*100} %`}</Typography>
  <Chip label={phase.status}/>
</Grid>;

export default withStyles(styles, { withTheme: true })(ProjectPhaseStatus);
