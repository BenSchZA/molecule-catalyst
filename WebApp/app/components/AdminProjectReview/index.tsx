/**
 *
 * AdminProjectReview
 *
 */

import React from 'react';
import { Theme, createStyles, withStyles, WithStyles, Container, Table, TableBody, TableRow, TableCell, Typography, Paper, Button } from '@material-ui/core';
import { colors } from 'theme';
import { forwardTo } from 'utils/history';

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
  });

interface OwnProps extends WithStyles<typeof styles> {
  project: any,
}

const AdminProjectReview: React.SFC<OwnProps> = (props: OwnProps) => (
  <Container>
      <Paper className={props.classes.banner} elevation={0}>
      <Button className={props.classes.backButton} onClick={() => forwardTo(`/admin`)}>Back</Button>
      <Typography variant='h5'>User Details</Typography>
      </Paper>
      <Paper>
    <Table>
      <TableBody>
        <TableRow className={props.classes.altRow}>
          <TableCell className={props.classes.altRowCell}>
            Full Name
            </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
           
          </TableCell>
        </TableRow>
        <TableRow className={props.classes.altRow}>
          <TableCell className={props.classes.altRowCell}>
            Status
            </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
           
          </TableCell>
        </TableRow>
        <TableRow className={props.classes.altRow}>
          <TableCell className={props.classes.altRowCell}>
            Project Title
            </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
           
          </TableCell>
        </TableRow>
        <TableRow className={props.classes.altRow}>
          <TableCell className={props.classes.altRowCell}>
            Abstract
            </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
  
          </TableCell>
        </TableRow>
        <TableRow className={props.classes.altRow}>
          <TableCell className={props.classes.altRowCell}>
           Featured Image
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            image.png
          </TableCell>
        </TableRow>
        <TableRow className={props.classes.altRow}>
          <TableCell className={props.classes.altRowCell}>
            Background & Significance
            </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
           
          </TableCell>
        </TableRow>
        <TableRow className={props.classes.altRow}>
          <TableCell className={props.classes.altRowCell}>
            Approach
            </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
           
          </TableCell>
        </TableRow>
        <TableRow className={props.classes.altRow}>
          <TableCell className={props.classes.altRowCell}>
            Collaborators
            </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
           <Table>
             <TableBody>
               <TableRow>
                 <TableCell>Full Name</TableCell>
                 <TableCell>Professional Title</TableCell>
                 <TableCell>Organisation</TableCell>
               </TableRow>
             </TableBody>
           </Table>
          </TableCell>
        </TableRow>
        <TableRow className={props.classes.altRow}>
          <TableCell className={props.classes.altRowCell}>
            Phase 1
            </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
          <Table>
             <TableBody>
               <TableRow>
                 <TableCell>Description: </TableCell>
                 <TableCell>Lorem Ipsum</TableCell>
               </TableRow>
               <TableRow>
                 <TableCell>Result:</TableCell>
                 <TableCell>Lorem Ipsum</TableCell>
               </TableRow>
               <TableRow>
                 <TableCell>Funding Goal:</TableCell>
                 <TableCell>$100, 000</TableCell>
               </TableRow>
             </TableBody>
           </Table>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    </Paper>
  </Container>
);

export default withStyles(styles, { withTheme: true })(AdminProjectReview);
