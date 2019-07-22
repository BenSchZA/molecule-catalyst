/**
 *
 * UnauthorizedPage
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, Typography } from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    // JSS in CSS goes here
  });

interface OwnProps extends WithStyles<typeof styles> {}

const UnauthorizedPage: React.SFC<OwnProps> = (props: OwnProps) => {
  return <Fragment>
    <Typography>
      You're going where you shouldn't be
    </Typography>
  </Fragment>;
};

export default withStyles(styles, { withTheme: true })(UnauthorizedPage);
