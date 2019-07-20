import React, { Fragment } from 'react';
import { compose } from 'redux';
import { Theme, WithStyles, withWidth, Typography } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({

});

interface OwnProps extends WithStyles<typeof styles> {
  classes: any;
}

const Dashboard: React.SFC<OwnProps> = (props: OwnProps) =>{
  const { classes } = props;

  return (
    <Fragment>
      <section className={classes.layout}>
        <Typography>Discover Content</Typography>
      </section>
    </Fragment>
  );
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withWidth(),
)(Dashboard);
