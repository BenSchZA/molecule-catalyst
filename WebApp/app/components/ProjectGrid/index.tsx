import React from 'react';
import { compose } from 'redux';
import { Theme, WithStyles, Typography, Container } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import { Project } from 'domain/projects/types';
import { forwardTo } from 'utils/history';

const styles = (theme: Theme) => createStyles({

});

interface OwnProps extends WithStyles<typeof styles> {
  classes: any;
  projects: Array<Project>;
}

const ProjectGrid: React.FunctionComponent<OwnProps> = ({projects}: OwnProps) => (
  <Container maxWidth='lg'>
    <Typography>Project Grid</Typography>
    {projects && projects.length > 0 && projects.map(p =>
      <Typography key={p.id} onClick={() => forwardTo(`/project/${p.id}`)}>{p.title}</Typography>
    )}
  </Container>
);

export default compose(
  withStyles(styles, { withTheme: true }),
)(ProjectGrid);
