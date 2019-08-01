/**
 *
 * CreatorsAwaitingReview
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
      marginBottom: '12px',
      float: 'right'
    },
    emptyRow: {
      height: '71px',
    }
    
  });

interface OwnProps extends WithStyles<typeof styles> {
  creatorApplications: Array<{
    id: string,
    fullName: string,
    email: string,
    createdAt: Date,
    affiliatedOrganisation: string,
  }>,
  approveCreatorApplication(applicationId: string): void,
}

const CreatorsAwaitingReview: React.SFC<OwnProps> = (props: OwnProps) => (
 
  <Fragment>
     <Paper className={props.classes.banner} elevation={0}>
    <Typography variant='h5'>Awaiting Approval</Typography>
    <Paper>
    <Table>
      <TableHead>
        <TableCell>Full Name</TableCell>
        <TableCell>Email</TableCell>
        <TableCell>Application Date</TableCell>
        <TableCell>Associated Organisation</TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
      </TableHead>
      <TableBody>
        {props.creatorApplications.length > 0 ? props.creatorApplications.map(ca => (
          <TableRow key={ca.id}>
            <TableCell>{ca.fullName}</TableCell>
            <TableCell>{ca.email}</TableCell>
            <TableCell>{dayjs(ca.createdAt).format('YYYY-MM-DD HH:mm')}</TableCell>
            <TableCell>{ca.affiliatedOrganisation}</TableCell>
            <TableCell>
              <Button className={props.classes.actionButton} onClick={() => props.approveCreatorApplication(ca.id)}>Approve</Button>
              <Button className={props.classes.actionButton} onClick={() => console.log(ca.id)}>Reject</Button>
            </TableCell>
          </TableRow>
        )) : <TableRow className={props.classes.emptyRow}>
        <TableCell>No awaiting approvals</TableCell>
      </TableRow>}
        
      </TableBody>
    </Table>
    </Paper>
    </Paper>
  </Fragment>


);


export default withStyles(styles, { withTheme: true })(CreatorsAwaitingReview);
