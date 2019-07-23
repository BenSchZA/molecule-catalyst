/**
 *
 * NotFoundPage
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, Typography } from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    // JSS in CSS goes here
  });

interface OwnProps extends WithStyles<typeof styles> {}

const NotFoundPage: React.SFC<OwnProps> = (props: OwnProps) => {
  return <Fragment>
    <Typography>
      These are not the droids you are looking for
    </Typography>
  </Fragment>;
};

export default withStyles(styles, { withTheme: true })(NotFoundPage);
