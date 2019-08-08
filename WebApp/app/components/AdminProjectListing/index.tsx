/**
 *
 * AdminProjectListing
 *
 */

import React, { Fragment } from 'react';
import { colors } from 'theme';
import { Theme, createStyles, withStyles, WithStyles, Typography, TableHead, Table, TableCell, TableBody, TableRow, Button, Paper } from '@material-ui/core';
import { forwardTo } from 'utils/history';
import { ProjectSubmissionStatus } from 'containers/AdminProjectListingContainer/types';
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
    }
  });

interface OwnProps extends WithStyles<typeof styles> {
  projects: Array<any>,
}

const AdminProjectListing: React.FunctionComponent<OwnProps> = (props: OwnProps) => (
  <Fragment>
    <Paper className={props.classes.banner} elevation={0}>
      <Typography variant='h5'>Projects</Typography>
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
              <TableRow key={project.id}>
                <TableCell>{project.title}</TableCell>
                <TableCell>{project.user.fullName || project.user.ethAddress}</TableCell>
                <TableCell>{ProjectSubmissionStatus[project.status]}</TableCell>
                <TableCell>{dayjs(project.createdAt).format('YYYY-MM-DD HH:mm')}</TableCell>
                <TableCell>
                  <Button className={props.classes.actionButton} onClick={() => {forwardTo(`/admin/project/${project.id}`)}}>Details</Button>
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
);


export default withStyles(styles, { withTheme: true })(AdminProjectListing);
