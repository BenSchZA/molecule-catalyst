/**
 *
 * ProjectDetails
 *
 */

import React from 'react';
import { Theme, createStyles, withStyles, WithStyles, Container, Typography } from '@material-ui/core';
import { Project, ProjectSubmissionStatus } from 'domain/projects/types';
import apiUrlBuilder from 'api/apiUrlBuilder';

const styles = (theme: Theme) =>
  createStyles({
    // JSS in CSS goes here
  });

interface OwnProps extends WithStyles<typeof styles> {
  project: Project,
}

const ProjectDetails: React.FunctionComponent<OwnProps> = ({project}: OwnProps) => (
  <Container maxWidth='lg'>
    <Typography variant='h4'>{project.title}</Typography>
    <Typography variant='h6'>Researcher: {project.user.fullName}</Typography>
    <Typography variant='h6'>Organization: {project.user.affiliatedOrganisation}</Typography>
    <Typography variant='h6'>Status: {ProjectSubmissionStatus[project.status]}</Typography>
    <img src={apiUrlBuilder.attachmentStream(project.featuredImage)} />
    <Typography variant='h6'>Abstract: {project.abstract}</Typography>
  </Container>
);

export default withStyles(styles, { withTheme: true })(ProjectDetails);
