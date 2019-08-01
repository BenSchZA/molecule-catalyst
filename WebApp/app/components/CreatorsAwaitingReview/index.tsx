/**
 *
 * CreatorsAwaitingReview
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, Typography, TableHead, Table, TableCell, TableBody, TableRow, Button } from '@material-ui/core';
import dayjs from 'dayjs'

const styles = (theme: Theme) =>
  createStyles({
    // JSS in CSS goes here
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

const CreatorsAwaitingReview: React.SFC<OwnProps> = ({ creatorApplications, approveCreatorApplication }: OwnProps) => (
  <Fragment>
    <Typography>Awaiting Approval</Typography>
    <Table>
      <TableHead>
        <TableCell>Full Name</TableCell>
        <TableCell>Email</TableCell>
        <TableCell>Application Date</TableCell>
        <TableCell>Associated Organisation</TableCell>
        <TableCell></TableCell>
      </TableHead>
      <TableBody>
        {creatorApplications.map(ca => (
          <TableRow key={ca.id}>
            <TableCell>{ca.fullName}</TableCell>
            <TableCell>{ca.email}</TableCell>
            <TableCell>{dayjs(ca.createdAt).format('YYYY-MM-DD HH:mm')}</TableCell>
            <TableCell>{ca.affiliatedOrganisation}</TableCell>
            <TableCell>
              <Button onClick={() => approveCreatorApplication(ca.id)}>Approve</Button>
              <Button onClick={() => console.log(ca.id)}>Reject</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Fragment>
);


export default withStyles(styles, { withTheme: true })(CreatorsAwaitingReview);
