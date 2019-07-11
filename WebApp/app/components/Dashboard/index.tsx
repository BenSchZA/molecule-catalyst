import { Paper, Theme, Typography } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import React, { Fragment } from 'react';

const styles = ({ spacing, breakpoints }: Theme) => createStyles({
  layout: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: spacing(3),
    marginRight: spacing(3),
    [breakpoints.up(400 + spacing(6))]: {
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${spacing(2)}px ${spacing(3)}px ${spacing(3)}px`,
  },
});

function LandingPage(props) {
  const { classes } = props;

  return (
  <Fragment>
    <main className={classes.layout}>
      <Paper className={classes.paper}>
        <Typography variant="h4">Dashboard</Typography>
      </Paper>
    </main>
  </Fragment>
  );
}

export default withStyles(styles, { withTheme: true })(LandingPage);
