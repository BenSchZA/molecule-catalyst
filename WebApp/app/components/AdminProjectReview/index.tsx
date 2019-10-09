/**
 *
 * AdminProjectReview
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, Container, Table, TableBody, TableRow, TableCell, Typography, Paper, Button, Grid } from '@material-ui/core';
import { colors } from 'theme';
import { forwardTo } from 'utils/history';
import { ProjectSubmissionStatus } from '../../domain/projects/types';

const styles = (theme: Theme) =>
  createStyles({
    altRow: {
      backgroundColor: colors.grey,
    },
    altRowCell: {
      color: theme.palette.text.secondary,
    },
    actionButton: {
      marginTop: '12px',
      marginBottom: '12px',
      float: 'right'
    },
    banner: {
      marginBottom: '16px',
      backgroundColor: colors.lightGrey,
      width: '100%'
    },
    backButton: {
      float: 'right'
    },
    buttonBar: {
      textAlign: 'right',
      paddingRight: 0,
    },
    titles: {
      whiteSpace: 'nowrap',
    }
  });

interface OwnProps extends WithStyles<typeof styles> {
  project: any,
  approveProject(): void;
  rejectProject(): void;
}

const AdminProjectReview: React.FunctionComponent<OwnProps> = ({ project, classes, approveProject, rejectProject }: OwnProps) => (
  <Container>
    <Paper className={classes.banner} elevation={0}>
      <Button className={classes.backButton} onClick={() => forwardTo(`/admin/projects`)}>Back</Button>
      <Typography variant='h5'>Project Details</Typography>
    </Paper>
    <Paper>
      <Table>
        <TableBody>
          <TableRow className={classes.altRow}>
            <TableCell className={classes.altRowCell}>
              Full Name
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              {project.user.fullName || project.user.ethAddress.toUpperCase()}
            </TableCell>
          </TableRow>
          <TableRow className={classes.altRow}>
            <TableCell className={classes.altRowCell}>
              Status
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              {ProjectSubmissionStatus[project.status].toUpperCase()}
            </TableCell>
          </TableRow>
          <TableRow className={classes.altRow}>
            <TableCell className={classes.altRowCell}>
              Project Title
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              {project.title}
            </TableCell>
          </TableRow>
          <TableRow className={classes.altRow}>
            <TableCell className={classes.altRowCell}>
              Abstract
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              {project.abstract}
            </TableCell>
          </TableRow>
          <TableRow className={classes.altRow}>
            <TableCell className={classes.altRowCell}>
              Featured Image
          </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              image.png
          </TableCell>
          </TableRow>
          <TableRow className={classes.altRow}>
            <TableCell className={classes.altRowCell}>
              Organisation Image
          </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              image.png
          </TableCell>
          </TableRow>
          <TableRow className={classes.altRow}>
            <TableCell className={classes.altRowCell}>
              Background & Significance
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              {project.context}
            </TableCell>
          </TableRow>
          <TableRow className={classes.altRow}>
            <TableCell className={classes.altRowCell}>
              Approach
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              {project.approach}
            </TableCell>
          </TableRow>
          <TableRow className={classes.altRow}>
            <TableCell className={classes.altRowCell}>
              Collaborators
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Table>
                <TableBody>
                  {project.collaborators && project.collaborators.map((c, i) =>
                    <TableRow key={i}>
                      <TableCell>{c.fullName}</TableCell>
                      <TableCell>{c.professionalTitle}</TableCell>
                      <TableCell>{c.affiliatedOrganisation}</TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </TableCell>
          </TableRow>
          {project.researchPhases && project.researchPhases.map((rp, i) =>
            <Fragment key={i}>
              <TableRow className={classes.altRow}>
                <TableCell className={classes.altRowCell}>
                  {`Phase ${i + 1}`}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Table>
                    <TableBody>
                    <TableRow>
                        <TableCell className={classes.titles}>Title: </TableCell>
                        <TableCell>{rp.title}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.titles}>Description: </TableCell>
                        <TableCell>{rp.description}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.titles}>Result:</TableCell>
                        <TableCell>{rp.result}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.titles}>Funding Goal:</TableCell>
                        <TableCell>{rp.fundingGoal}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.titles}>Duration:</TableCell>
                        <TableCell>{rp.duration + (rp.duration > 1 ? ' months': ' month')}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            </Fragment>)}
        </TableBody>
      </Table>
    </Paper>
    <Grid className={classes.buttonBar}>
      {(project.status === ProjectSubmissionStatus.created) &&
        <Fragment>
          <Button onClick={() => approveProject()}>Approve</Button>
          <Button onClick={() => rejectProject()}>Decline</Button>
        </Fragment>}
    </Grid>
  </Container>
);

export default withStyles(styles, { withTheme: true })(AdminProjectReview);
