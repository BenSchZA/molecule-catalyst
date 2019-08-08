import React, { Fragment } from 'react';
import { compose } from 'redux';
import { Theme, WithStyles, withWidth } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import ProjectCard from 'components/ProjectCard';

const styles = (theme: Theme) => createStyles({

});

interface OwnProps extends WithStyles<typeof styles> {
  classes: any;
}

const Dashboard: React.FunctionComponent<OwnProps> = (props: OwnProps) =>{
  return (
    <Fragment>
        <ProjectCard project={{}}/>
    </Fragment>
  );
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withWidth(),
)(Dashboard);
