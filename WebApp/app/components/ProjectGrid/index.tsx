import React, { Fragment } from 'react';
import { compose } from 'redux';
import { Theme, WithStyles, withWidth, Typography } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({

});

interface OwnProps extends WithStyles<typeof styles> {
  classes: any;
}

const ProjectGrid: React.FunctionComponent<OwnProps> = (props: OwnProps) => (
  <Fragment>
    <Typography>Project Grid</Typography>
  </Fragment>
);

export default compose(
  withStyles(styles, { withTheme: true }),
  withWidth(),
)(ProjectGrid);
