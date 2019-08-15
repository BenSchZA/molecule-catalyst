import React from 'react';
import { compose } from 'redux';
import { Theme, WithStyles, Container, Grid } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import { Project } from 'domain/projects/types';
import ProjectCard from 'components/ProjectCard';

const styles = (theme: Theme) => createStyles({

});

interface OwnProps extends WithStyles<typeof styles> {
  classes: any;
  projects: Array<Project>;
}

const ProjectGrid: React.FunctionComponent<OwnProps> = ({projects}: OwnProps) => (
  <Container maxWidth='md'>

    <Grid container spacing={3}>
    {projects && projects.length > 0 && projects.map(p =>
    <Grid item xs={6}>
      <ProjectCard project={p}/>
      </Grid>
    )}
    </Grid>
  </Container>
);

export default compose(
  withStyles(styles, { withTheme: true }),
)(ProjectGrid);
