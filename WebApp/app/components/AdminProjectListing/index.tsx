/**
 *
 * AdminProjectListing
 *
 */

import React, { Fragment } from 'react';
import { colors } from 'theme';
import { Theme, createStyles, withStyles, WithStyles, Typography, TableHead, Table, TableCell, TableBody, TableRow, Button, Paper } from '@material-ui/core';
import { forwardTo } from 'utils/history';

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

const AdminProjectListing: React.SFC<OwnProps> = (props: OwnProps) => (
  <Fragment>
    <Paper className={props.classes.banner} elevation={0}>
      <Typography variant='h5'>Projects</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableCell>Project Title</TableCell>
            <TableCell>Full Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created</TableCell>
            <TableCell></TableCell>
          </TableHead>
          <TableBody>
            {props.projects && props.projects.length > 0 ? props.projects.map(project => (
              <TableRow key={project.id}>
                <TableCell>{project.title}</TableCell>
                <TableCell>user</TableCell>
                <TableCell>status</TableCell>
                <TableCell>TIME</TableCell>
                <TableCell>
                  <Button className={props.classes.actionButton} onClick={() => forwardTo(`admin/project/${project.id}`)}>Details</Button>
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
