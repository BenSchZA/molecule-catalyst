/**
 *
 * ProjectDetails
 *
 */

import React from 'react';
import { Theme, createStyles, withStyles, WithStyles, Container, Typography } from '@material-ui/core';
import { Project } from 'domain/projects/types';

const styles = (theme: Theme) =>
  createStyles({
    // JSS in CSS goes here
  });

interface OwnProps extends WithStyles<typeof styles> {
  project: Project,
}

const ProjectDetails: React.FunctionComponent<OwnProps> = (props: OwnProps) => (
  <Container>
    <Typography>Project Details</Typography>
    <Typography>{props.project.title}</Typography>
  </Container>
);

export default withStyles(styles, { withTheme: true })(ProjectDetails);
