/**
 *
 * AdminProjectReview
 *
 */

import React, { Fragment, useState } from 'react';
import { Theme, createStyles, withStyles, WithStyles, Container, Table, TableBody, TableRow, TableCell, Typography, Paper, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import { colors } from 'theme';
import { forwardTo } from 'utils/history';
import { ProjectSubmissionStatus } from '../../domain/projects/types';
import MoleculeSpinner from 'components/MoleculeSpinner';

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
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      position: "absolute",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      zIndex: 3,
    },
    spinner: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }
  });

interface OwnProps extends WithStyles<typeof styles> {
  project: any;
  txInProgress: boolean;
  launchProject(researchContributionRate: number): void;
  rejectProject(): void;
}

const AdminProjectReview: React.FunctionComponent<OwnProps> = ({ project, classes, launchProject, rejectProject, txInProgress }: OwnProps) => {
  const [launchModalOpen, setLaunchModalOpen] = useState(false);
  const [reasearchContributionRate, setResearchContributionRate] = useState(15);

  const handleCloseLaunchModal = () => {
    setLaunchModalOpen(false);
    setResearchContributionRate(15);
  }
  const handleOpenLaunchModal = () => setLaunchModalOpen(true);

  return (
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
                          <TableCell>{rp.duration + (rp.duration > 1 ? ' months' : ' month')}</TableCell>
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
            <Button onClick={() => forwardTo(`/admin/project/${project.id}/preview`)}>Preview</Button>
            <Button onClick={handleOpenLaunchModal}>Approve</Button>
            <Button onClick={() => forwardTo(`/admin/project/${project.id}/edit`)}>Edit</Button>
            <Button onClick={rejectProject}>Decline</Button>
          </Fragment>}
      </Grid>
      <Dialog
        onClose={handleCloseLaunchModal}
        open={launchModalOpen} >
        <div className={classes.overlay} style={{ display: (txInProgress) ? "block" : "none" }}>
          <div className={classes.spinner}>
            <MoleculeSpinner />
          </div>
        </div>
        <DialogTitle id="customized-dialog-title">
          Approve Project
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Specify the research contribution rate
          </Typography>
          <TextField
            type='number'
            autoFocus
            value={reasearchContributionRate}
            onChange={(e) => setResearchContributionRate(Number(e.target.value))}
            inputProps={{
              min: 1,
              max: 99,
              step: 1,
            }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLaunchModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => launchProject(reasearchContributionRate)} color="primary">
            Approve project
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
};

export default withStyles(styles, { withTheme: true })(AdminProjectReview);
