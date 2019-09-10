/**
 *
 * AdminProjectListing
 *
 */

import React, { Fragment } from 'react';
import { colors } from 'theme';
import { Theme, createStyles, withStyles, WithStyles, Typography, TableHead, Table, TableCell, TableBody, TableRow, Button, Paper, TextField, MenuItem } from '@material-ui/core';
import { forwardTo } from 'utils/history';
import { ProjectSubmissionStatus } from '../../domain/projects/types';
import dayjs from 'dayjs'

const styles = (theme: Theme) =>
  createStyles({
    banner: {
      marginBottom: '16px',
      backgroundColor: colors.lightGrey,
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
    },
    body1: {
      fontWeight: 'bold',
      color: colors.textBlack,
      paddingBottom: '16px',
      paddingLeft: '8px',
      paddingRight: '8px'
    }
  });

interface OwnProps extends WithStyles<typeof styles> {
  projects: Array<any>,
  statusFilter: number,
  setStatusfilter(value: number) : void
}

const AdminProjectListing: React.FunctionComponent<OwnProps> = (props: OwnProps) => {
  const filterStatuses = [{
    label: 'All Statuses',
    value: -1
  }, {
    label: 'In Review',
    value: ProjectSubmissionStatus.created,
  }, {
    label: 'Ongoing',
    value: ProjectSubmissionStatus.started,
  }, {
    label: 'Ended',
    value: ProjectSubmissionStatus.ended,
  }, {
    label: 'Declined',
    value: ProjectSubmissionStatus.rejected,
  }]

  return (
  <Fragment>
    <Paper className={props.classes.banner} elevation={0}>
      <Typography variant='h5'>Projects</Typography>
      <Typography variant='body1'>Status</Typography>
      <TextField
        name='projectStatus'
        select
        value={props.statusFilter}
        onChange={(e) => props.setStatusfilter(Number(e.target.value))}>
        {filterStatuses.map(option => (
          <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
        ))}
      </TextField>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project Title</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.projects && props.projects.length > 0 ? props.projects.map(project => (
              <TableRow key={project.id} >
                <TableCell className={props.classes.rowText}>{project.title}</TableCell>
                <TableCell className={props.classes.rowText}>{project.user.fullName || project.user.ethAddress.toUpperCase()}</TableCell>
                <TableCell className={props.classes.rowText}>{ProjectSubmissionStatus[project.status].toUpperCase()}</TableCell>
                <TableCell className={props.classes.rowText}>{dayjs(project.createdAt).format('YYYY-MM-DD HH:mm')}</TableCell>
                <TableCell>
                  <Button className={props.classes.actionButton} onClick={() => { forwardTo(`/admin/project/${project.id}`) }}>Details</Button>
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
  </Fragment>
)};


export default withStyles(styles, { withTheme: true })(AdminProjectListing);
