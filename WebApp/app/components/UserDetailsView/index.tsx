/**
 *
 * UserDetailsView
 *
 */

import React from 'react';
import { Theme, createStyles, withStyles, WithStyles, Container, Table, TableBody, TableRow, TableCell, Typography } from '@material-ui/core';
import { colors } from 'theme';
import { UserType } from 'containers/App/routes';

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
    heading: {
      float: 'left',
      marginTop: '24px',
    }
  });

interface OwnProps extends WithStyles<typeof styles> {
  user: {
    id: string,
    type: number,
    ethAddress: string,
    createdAt: Date,
    fullName?: string,
    email?: string,
    affiliatedOrganisation?: string,
    biography?: string,
    professionalTitle?: string,
    profileImage?: any
  },
}

const UserDetailsView: React.SFC<OwnProps> = (props: OwnProps) => (
  <Container>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>
            <Typography className={props.classes.heading}>User Details</Typography>
          </TableCell>
        </TableRow>
        <TableRow className={props.classes.altRow}>
          <TableCell className={props.classes.altRowCell}>
            User Address
            </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            {props.user.ethAddress.toUpperCase()}
          </TableCell>
        </TableRow>
        <TableRow className={props.classes.altRow}>
          <TableCell className={props.classes.altRowCell}>
            Type
            </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            {UserType[props.user.type]}
          </TableCell>
        </TableRow>
        <TableRow className={props.classes.altRow}>
          <TableCell className={props.classes.altRowCell}>
            Email
            </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            {props.user.email}
          </TableCell>
        </TableRow>
        <TableRow className={props.classes.altRow}>
          <TableCell className={props.classes.altRowCell}>
            Full Name
            </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            {props.user.fullName}
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
            {props.user.biography}
          </TableCell>
        </TableRow>
        <TableRow className={props.classes.altRow}>
          <TableCell className={props.classes.altRowCell}>
            Professional Title
            </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            {props.user.professionalTitle}
          </TableCell>
        </TableRow>
        <TableRow className={props.classes.altRow}>
          <TableCell className={props.classes.altRowCell}>
            Affiliated Organisation
            </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            {props.user.affiliatedOrganisation}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Container>
);

export default withStyles(styles, { withTheme: true })(UserDetailsView);
