/**
 *
 * AdminProjectListing
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, Typography, TableHead, Table, TableCell, TableBody, TableRow, Button, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { ProjectSubmissionStatus, Project } from '../../domain/projects/types';
import dayjs from 'dayjs'

const styles = (theme: Theme) =>
  createStyles({
    banner: {
      marginBottom: '16px',
      backgroundColor: 'transparent',
      width: '100%'
    },
    maxWidth: {
      width: '1200px!important'
    },
    actionButton: {
      marginTop: '12px',
      marginBottom: '12px'
    },
    emptyRow: {
      height: '71px',
    },
    rowText: {
      fontSize: theme.typography.pxToRem(12),
    }
  });

interface OwnProps extends WithStyles<typeof styles> {
  myProjects: Array<Project>,
  launchProject(projectId: string): void,
}

const MyProjectsListing: React.FunctionComponent<OwnProps> = (props: OwnProps) => {
  const [open, setOpen] = React.useState(false);
  const [projectId, setProjectId] = React.useState('');

  function handleOpen(projectId: string) {
    setOpen(true);
    setProjectId(projectId);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleLaunch() {
    props.launchProject(projectId);
    setOpen(false);
  }

  return (
    <Fragment>
      <Paper className={props.classes.banner} elevation={0}>
        <Typography variant='h5'>Projects</Typography>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Project Title</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Status</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.myProjects && props.myProjects.length > 0 ? props.myProjects.map(project => (
                <TableRow key={project.id} >
                  <TableCell className={props.classes.rowText}>{project.title}</TableCell>
                  <TableCell className={props.classes.rowText}>{dayjs(project.createdAt).format('YYYY-MM-DD HH:mm')}</TableCell>
                  <TableCell className={props.classes.rowText}>{ProjectSubmissionStatus[project.status].toUpperCase()}</TableCell>
                  <TableCell>
                    {(project.status === ProjectSubmissionStatus.accepted)
                      && <Button className={props.classes.actionButton} onClick={() => handleOpen(project.id)}>Launch Project</Button>}
                  </TableCell>
                </TableRow>
              )) :
                <TableRow className={props.classes.emptyRow}>
                  <TableCell>No projects</TableCell>
                </TableRow>}
            </TableBody>
          </Table>
        </Paper>
      </Paper>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>LAUNCH CAMPAIGN</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm campaign launch. This step is irreversible, project details can no longer be updated.
          </DialogContentText>
          <DialogActions>
            <Button onClick={handleLaunch}>Launch Project</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
};


export default withStyles(styles, { withTheme: true })(MyProjectsListing);
