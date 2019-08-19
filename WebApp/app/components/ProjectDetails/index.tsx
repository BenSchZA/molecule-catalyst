/**
 *
 * ProjectDetails
 *
 */

import React from 'react';
import { Theme, createStyles, withStyles, WithStyles, Container, Typography, Button, Paper, Divider, Grid, Avatar, Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import { Project, ProjectSubmissionStatus } from 'domain/projects/types';
import apiUrlBuilder from 'api/apiUrlBuilder';
import { Face } from '@material-ui/icons';

const styles = ({ spacing }: Theme) =>
  createStyles({
    projectSection: {
      padding: spacing(2),
      margin: spacing(2),
    },
    researcherAvatar: {
      height: 120,
      width: 120,
    }
  });

interface OwnProps extends WithStyles<typeof styles> {
  project: Project,
}

const ProjectDetails: React.FunctionComponent<OwnProps> = ({ project, classes }: OwnProps) => (
  (project) ? 
  <Container maxWidth='lg'>
    <Paper className={classes.projectSection}>
      <Typography variant='h4'>{project.title}</Typography>
      <Typography variant='h6'>Researcher: {project.user.fullName}</Typography>
      <Typography variant='h6'>Organization: {project.user.affiliatedOrganisation}</Typography>
      <Typography variant='h6'>Status: {ProjectSubmissionStatus[project.status]}</Typography>
      <img src={apiUrlBuilder.attachmentStream(project.featuredImage)} />
      <Button onClick={() => console.log('buy')}>Support Project</Button>
      <Button onClick={() => console.log('sell')}>Redeem Holdings</Button>
      <Divider />
      <Typography variant='h6'>Abstract: {project.abstract}</Typography>
    </Paper>
    <Paper className={classes.projectSection}>
      <Typography variant='h4'>Research Background</Typography>
      <Typography variant='subtitle2'>What is the significance of your research</Typography>
      <Typography>{project.context}</Typography>
      <Typography variant='subtitle2'>What is the experimental approach for this reseach initiative</Typography>
      <Typography>{project.approach}</Typography>
    </Paper>
    <Paper className={classes.projectSection}>
      <Typography variant='h4'>Team</Typography>
      <Typography variant='subtitle2'>Reseacher</Typography>
      <Grid container direction='row'>
        <Grid item>
          <Typography variant='body1'>{project.user.fullName || ''}</Typography>
          <Typography variant='body2'>{project.user.professionalTitle || ''}</Typography>
          <Typography variant='body2'>{project.user.affiliatedOrganisation || ''}</Typography>
        </Grid>
        <Grid item>
          <Avatar className={classes.researcherAvatar} src={project.user.profileImage && apiUrlBuilder.attachmentStream(project.user.profileImage)}>
            {!project.user.profileImage && <Face fontSize='large' />}
          </Avatar>
        </Grid>
        <Grid item>
          <Typography>{project.user.biography}</Typography>
        </Grid>
      </Grid>
      <Typography variant='subtitle2'>Contributors</Typography>
      <Table>
        <TableBody>
          {project.collaborators && project.collaborators.map((c, i) =>
            <TableRow key={i}>
              <TableCell>{c.fullName}</TableCell>
              <TableCell>{c.professionalTitle}</TableCell>
              <TableCell>{c.affiliatedOrganisation}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  </Container> :
  <Container>
    Loading data
  </Container>
);

export default withStyles(styles, { withTheme: true })(ProjectDetails);
