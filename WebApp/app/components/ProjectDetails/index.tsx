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
import { colors } from 'theme';

const styles = ({ spacing }: Theme) =>
  createStyles({
    projectSection: {
      padding: spacing(2),
      margin: spacing(2),
    },
    researcherAvatar: {
      position: 'relative',
      height: 79,
      width: 79,
      left: '3rem',
      transform: 'translate(0, -50%)'
    },
    bannerWrapper: {
      position: 'relative',
      "&:after": {
        content: "''",
        display: "block",
        position: "absolute",
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        background: '#003E52',
        zIndex: 1,
        opacity: 0.69,
      }
    },
    bannerImage: {
      width: '100%',
    },
    bannerContent: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      left: '50%',
      top: '35%',
      transform: 'translate(-50%, -50%)',
      zIndex: 2,
      color: colors.white
    },
    bannerFooter: {
      width: '100%',
      background: "#003E52",
      opacity: 0.83,
      backdropFilter: 'blur(31px)',
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      left: '50%',
      transform: 'translate(-50%, -100%)',
      zIndex: 2,
      color: colors.white
    }
  });

interface OwnProps extends WithStyles<typeof styles> {
  project: Project,
}

const ProjectDetails: React.FunctionComponent<OwnProps> = ({ project, classes }: OwnProps) => (
  (project) ?
    <Container maxWidth='lg'>
      <div className={classes.bannerWrapper}>
        <img src={apiUrlBuilder.attachmentStream(project.featuredImage)} className={classes.bannerImage} />
        <div className={classes.bannerContent}>
          <Typography variant='h2'>{project.title}</Typography>
          <div>
            <Button onClick={() => console.log('buy')}>Support Project</Button>
            <Button onClick={() => console.log('sell')}>Redeem Holdings</Button>
          </div>
        </div>
        <div className={classes.bannerFooter}>
          <Avatar className={classes.researcherAvatar} src={project.user.profileImage && apiUrlBuilder.attachmentStream(project.user.profileImage)}>
            {!project.user.profileImage && <Face fontSize='large' />}
          </Avatar>
          <Typography variant='h6'>Researcher: {project.user.fullName}</Typography>
          <Typography variant='h6'>Organization: {project.user.affiliatedOrganisation}</Typography>
        </div>
      </div>
      <Paper className={classes.projectSection}>
        <Typography variant='h6'>Status: {ProjectSubmissionStatus[project.status]}</Typography>

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
