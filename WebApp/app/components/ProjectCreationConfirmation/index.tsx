/**
 *
 * ProjectCreationConfirmation
 *
 */

import React from 'react';
import { Theme, createStyles, withStyles, WithStyles, Typography, Container, Paper, Divider } from '@material-ui/core';
import { colors } from 'theme';

const styles = (theme: Theme) =>
  createStyles({
    banner: {
      paddingBottom: '18px',
      backgroundColor: colors.lightGrey,
      alignItems: 'center'
    },
    heading: {
      textAlign: 'center',
      maxWidth: '40vw',
      minWidth: '300px',
      margin: 'auto'
    },
    body1: {
      fontWeight: 'bold',
      color: colors.textBlack,
      paddingBottom: '16px',
      paddingLeft: '8px',
      paddingRight: '8px'
    }
  });

interface OwnProps extends WithStyles<typeof styles> {}

const ProjectCreationConfirmation: React.SFC<OwnProps> = (props: OwnProps) => (
  <Container maxWidth='md'>
    <Paper className={props.classes.banner} square={true} elevation={0}>
        <Typography variant='h2' className={props.classes.heading}>Project submitted successfully!</Typography>
        <Typography variant='body1' className={props.classes.heading}>
        Our team is busy reviewing your project. You will be notified once the project has been approved.
      </Typography>
        <Divider variant='middle' />
      </Paper>
  </Container>
);

export default withStyles(styles, { withTheme: true })(
  ProjectCreationConfirmation,
);
