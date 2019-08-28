import React from 'react';
import { compose } from 'redux';
import { Theme, WithStyles, Container, Grid, Divider } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import { Project } from 'domain/projects/types';
import ProjectCard from 'components/ProjectCard';
import { forwardTo } from 'utils/history';

const styles = (theme: Theme) => createStyles({
  maxWidthLg: {
    maxWidth: '1920px',
    marginRight: '0',
    marginLeft: '0',
    '@media (min-width: 1280px)': {
        maxWidth: '1920px',
  }},
  divider: {
    marginLeft: 303,
    marginTop: 200
  }
});

interface OwnProps extends WithStyles<typeof styles> {
  classes: any;
  projects: Array<Project>;
}

const ProjectGrid: React.FunctionComponent<OwnProps> = ({projects, classes}: OwnProps) => (
  <Container className={classes.maxWidthLg}>
     <Divider className={classes.divider} variant='middle' />
    <Grid 
    container
    spacing={2}
    direction="row"
    alignItems="center"
    justify="center">
    {projects && projects.length > 0 && projects.map(p =>
    <Grid item xs={6} sm={6}>
      <ProjectCard project={p}/>
      </Grid>
    )}
    </Grid>
  </Container>
);

export default compose(
  withStyles(styles, { withTheme: true }),
)(ProjectGrid);
