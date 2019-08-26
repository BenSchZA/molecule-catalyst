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
import ProjectPhaseStatus from 'components/ProjectPhaseStatus';

const styles = ({ spacing, palette }: Theme) =>
  createStyles({
    projectSection: {
      padding: spacing(4),
    },
    researcherAvatar: {
      position: 'relative',
      height: spacing(5),
      width: spacing(5),
      left: spacing(5),
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
      opacity: 0.63,
      backdropFilter: 'blur(31px)',
      display: 'flex',
      flexDirection: 'row',
      position: 'absolute',
      left: '50%',
      transform: 'translate(-50%, -100%)',
      zIndex: 3,
      color: colors.white,
    },
    fundingStatusSection: {
      width: '100%',
      background: '#F7F7F7',
    },
    fundingStatusItem: {
      borderRight: '1px',
      borderRightColor: palette.secondary.main,
    },
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
        <Grid container className={classes.bannerFooter} justify='space-between'>
          <Grid item xs={1}>
            <Avatar className={classes.researcherAvatar} src={project.user.profileImage && apiUrlBuilder.attachmentStream(project.user.profileImage)}>
              {!project.user.profileImage && <Face fontSize='large' />}
            </Avatar>
          </Grid>
          <Grid item xs={5}>
            <Typography variant='h6'>{project.user.fullName && project.user.fullName.toUpperCase()}</Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant='h6' align='right'>{project.user.affiliatedOrganisation && project.user.affiliatedOrganisation.toUpperCase()}</Typography>
          </Grid>
          <Grid item xs={1}>
          </Grid>
        </Grid>
      </div>
      <Paper className={classes.projectSection} square>
        <Grid container>
          <Grid item xs={6}>
            <Typography variant='h6'>START DATE: {('Date').toUpperCase()}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='h6' align='right'>STATUS: {ProjectSubmissionStatus[project.status].toUpperCase()}</Typography>
          </Grid>
        </Grid>
        <Divider />
        <Typography variant='h6'>Abstract</Typography>
        <Typography paragraph>{project.abstract}</Typography>
        <Typography variant='h6'>Funding Status</Typography>
        <Grid container className={classes.fundingStatusSection} direction='row' justify='space-evenly' alignItems='stretch'>
          <Grid item>
            <Typography>
              95.0%
            </Typography>
          </Grid>
          <Grid item>
            <Typography>
              Total Funding Goal
            </Typography>
            <Typography>
              55000 USD
            </Typography>
          </Grid>
          <Grid item>
            <Typography>
              Total Pledged
            </Typography>
            <Typography>
              50000 USD
            </Typography>
          </Grid>
          <Grid item>
            <Typography>
              Total Released
            </Typography>
            <Typography>
              45000 USD
            </Typography>
          </Grid>
          <Grid item>
            <Typography>
              Total Duration Left
            </Typography>
            <Typography>
              35 Days
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction='row' alignItems='center' justify='center' spacing={4}>
          {project.researchPhases && project.researchPhases.map((p, i) =>
            <ProjectPhaseStatus key={i} phase={{
              index: i+1,
              daysRemaining: 10,
              fundedAmount: 5000,
              fundingGoal: p.fundingGoal,
              title: p.title,
              status: 'Released'
            }} />
          )}
        </Grid>
      </Paper>
      <Paper className={classes.projectSection} square>
        <Typography variant='h4'>Research Background</Typography>
        <Typography variant='subtitle2'>What is the significance of your research</Typography>
        <Typography>{project.context}</Typography>
        <Typography variant='subtitle2'>What is the experimental approach for this reseach initiative</Typography>
        <Typography>{project.approach}</Typography>
      </Paper>
      <Paper className={classes.projectSection} square>
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
