/**
 *
 * UserManagement
 *
 */

import React, { Fragment } from 'react';
import {colors} from 'theme';
import { Theme, createStyles, withStyles, WithStyles, Typography, TableHead, Table, TableCell, TableBody, TableRow, Button, Paper } from '@material-ui/core';
import dayjs from 'dayjs'

const styles = (theme: Theme) =>
  createStyles({
    banner:{
      marginBottom: '16px',
      backgroundColor: colors.lightGrey,
      width: '100%'
    },
    maxWidth:{
      width: '1200px!important'
    },
    actionButton: {
      marginTop: '12px',
      marginBottom: '12px'
    }
  });

interface OwnProps extends WithStyles<typeof styles> {
  users: Array<{
    id: string,
    fullName: string,
    email: string,
    createdAt: Date,
    affiliatedOrganisation: string,
  }>
  
}

const UserManagement: React.SFC<OwnProps> = (props: OwnProps) => (
 
  <Fragment>
     <Paper className={props.classes.banner} elevation={0}>
    <Typography variant='h5'>User Management</Typography>
    <Paper>
    <Table>
      <TableHead>
        <TableCell>User Address</TableCell>
        <TableCell>Full Name</TableCell>
        <TableCell>Created</TableCell>
        <TableCell>Type</TableCell>
        <TableCell></TableCell>
      </TableHead>
      <TableBody>
        {props.users.map(ca => (
          <TableRow key={ca.id}>
            <TableCell>0xBF39CCeA0E5E305103D838966C0258dbA311247A</TableCell>
            <TableCell>{ca.fullName}</TableCell>
            <TableCell>{dayjs(ca.createdAt).format('YYYY-MM-DD HH:mm')}</TableCell>
            <TableCell>{ca.email}</TableCell>
            <TableCell>
              <Button className={props.classes.actionButton} onClick={() => console.log(ca.id)}>Details</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </Paper>
    </Paper>
  </Fragment>


);


export default withStyles(styles, { withTheme: true })(UserManagement);
