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
  return (
    <Fragment>
        <Typography>Discover Content</Typography>
    </Fragment>
  );
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withWidth(),
)(Dashboard);
