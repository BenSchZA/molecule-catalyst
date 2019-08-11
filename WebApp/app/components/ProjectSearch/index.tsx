/**
 *
 * ProjectSearch
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, Typography } from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    // JSS in CSS goes here
  });

interface OwnProps extends WithStyles<typeof styles> {}

const ProjectSearch: React.FunctionComponent<OwnProps> = (props: OwnProps) => (
  <Fragment>
    <Typography>Project Search</Typography>
  </Fragment>
);

export default withStyles(styles, { withTheme: true })(ProjectSearch);
