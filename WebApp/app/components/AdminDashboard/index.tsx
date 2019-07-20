/**
 *
 * AdminDashboard
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles } from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    // JSS in CSS goes here
  });

interface OwnProps extends WithStyles<typeof styles> {}

const AdminDashboard: React.SFC<OwnProps> = (props: OwnProps) => {
  return <Fragment>AdminDashboard</Fragment>;
};

export default withStyles(styles, { withTheme: true })(AdminDashboard);
