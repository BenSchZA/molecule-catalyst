/**
 *
 * UserDetailsView
 *
 */

import React from 'react';
import { Theme, createStyles, withStyles, WithStyles, Container, TableBody, Table, TableRow, TableCell, Button, Typography } from '@material-ui/core';
import {colors} from 'theme';

const styles = (theme: Theme) =>
  createStyles({
    root:{
      marginTop: '24px',
    },
    altRow:{
      backgroundColor: colors.grey,
    }, 
    altRowCell:{
      color: theme.palette.text.secondary,
    },
    actionButton: {
      marginTop: '12px',
      marginBottom: '12px',
      float: 'right'
    },
    heading: {
      float: 'left',
      marginTop: '24px',
    }
  });

interface OwnProps extends WithStyles<typeof styles> {
  userCreator: {
    id: string,
    fullName: string,
    user: any,
    email: string,
    createdAt: Date,
    affiliatedOrganisation: string,
    biography: string,
    professionalTitle: string,
    profileImage: any
  },
  approveCreatorApplication(applicationId: string): void,
  rejectCreatorApplication(applicationId: string): void,
 }

const UserDetailsView: React.SFC<OwnProps> = (props: OwnProps) => (
  <Container>
        <Table>
        <TableBody>
          <TableRow>
            <TableCell>
            <Typography className={props.classes.heading}>User Details</Typography>
            <Button className={props.classes.actionButton} onClick={() => props.approveCreatorApplication(props.userCreator.id)}>Approve</Button>
            <Button className={props.classes.actionButton} onClick={() => props.rejectCreatorApplication(props.userCreator.id)}>Reject</Button>
            </TableCell>
          </TableRow>
          <TableRow className={props.classes.altRow}>
            <TableCell className={props.classes.altRowCell}>
              User Address
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              {props.userCreator.user.ethAddress.toUpperCase()}
            </TableCell>
          </TableRow>
          <TableRow className={props.classes.altRow}>
            <TableCell className={props.classes.altRowCell}>
              Type
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
            {props.userCreator.user.type == 0 ? 'Standard' : (props.userCreator.user.type == 2 ? 'Admin' : 'Creator') }
            </TableCell>
          </TableRow>
          <TableRow className={props.classes.altRow}>
            <TableCell className={props.classes.altRowCell}>
              Email
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
            {props.userCreator.email}
            </TableCell>
          </TableRow>
          <TableRow className={props.classes.altRow}>
            <TableCell className={props.classes.altRowCell}>
              Full Name
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
            {props.userCreator.fullName}
            </TableCell>
          </TableRow>
          <TableRow className={props.classes.altRow}>
            <TableCell className={props.classes.altRowCell}>
              Picture
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              image.png
            </TableCell>
          </TableRow>
          <TableRow className={props.classes.altRow}>
            <TableCell className={props.classes.altRowCell}>
              About You
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
            {props.userCreator.biography}
            </TableCell>
          </TableRow>
          <TableRow className={props.classes.altRow}>
            <TableCell className={props.classes.altRowCell}>
              Professional Title
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
            {props.userCreator.professionalTitle}
            </TableCell>
          </TableRow>
          <TableRow className={props.classes.altRow}>
            <TableCell className={props.classes.altRowCell}>
             Affiliated Organisation
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
            {props.userCreator.affiliatedOrganisation}
            </TableCell>
          </TableRow>
        </TableBody>
        </Table>
  </Container>
);


export default withStyles(styles, { withTheme: true })(UserDetailsView);
