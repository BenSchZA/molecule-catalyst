/**
 *
 * CreatorApplicationForm
 *
 */

import React from 'react';
import { Theme, createStyles, withStyles, WithStyles, Paper, Typography, Container, Divider } from '@material-ui/core';
import { colors } from 'theme';
import UserDetailsForm from 'components/UserDetailsForm';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      marginTop: '70px',
      paddingLeft: '8px'
    },
    banner: {
      marginBottom: '16px',
      backgroundColor: 'transparent',
      alignItems: 'center'
    },
    heading: {
      textAlign: 'center',
      paddingTop: 140
    },
    headingText: {
      textAlign: 'center',
    },
    body1: {
      fontWeight: 'bold',
      color: colors.textBlack,
      paddingBottom: '16px',
      paddingLeft: '8px',
      paddingRight: '8px'
    },
  });

interface OwnProps extends WithStyles<typeof styles> { }

const CreatorApplicationForm: React.FunctionComponent<OwnProps> = (props: OwnProps) => (

  <Container>
    <Paper className={props.classes.banner} square={true} elevation={0}>
      <Typography variant='h3' className={props.classes.heading}>Add Profile Details</Typography>
      <Typography variant='body1' className={props.classes.headingText}>
        Before you can apply for funding for your scientific experiment on the Molecule platform you need to provide us with some more details about yourself and your research background. We will contact you directly after internal review.
      </Typography>
      <Divider variant='middle' />
    </Paper>
    <Container maxWidth='md'>
    <Paper className={props.classes.root} square={true}>
      <UserDetailsForm />
    </Paper>
    </Container>
  </Container>
);


export default withStyles(styles, { withTheme: true })(CreatorApplicationForm);
