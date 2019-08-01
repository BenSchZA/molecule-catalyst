/**
 *
 * CreatorApplicationForm
 *
 */

import React from 'react';
import { Theme, createStyles, withStyles, WithStyles, Paper, Typography, InputLabel, Button, Container } from '@material-ui/core';
import { Save } from '@material-ui/icons';
import { Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import UploadImageField from 'components/UploadImageField';
import {colors} from 'theme';

const styles = (theme: Theme) =>
  createStyles({
    root:{
      marginTop: '24px',
      paddingLeft: '8px'
      
    },
    banner:{
      marginBottom: '16px',
      backgroundColor: colors.lightGrey

    },
    heading:{
      textAlign: 'center',

    }
  });

interface OwnProps extends WithStyles<typeof styles> { }

const CreatorApplicationForm: React.SFC<OwnProps> = (props: OwnProps) => (
  
  <Container>
    <Paper className={props.classes.banner} square={true} elevation={0}>
    <Typography variant='h3' className={props.classes.heading}>Add Profile Details</Typography>
      <Typography variant='body1' className={props.classes.heading}>
        Before you can apply for funding for your scientific experiment on the Molecule platform you need to provide us with some more details about yourself and your research background. We will contact you directly after internal review.
      </Typography>
    </Paper>
    <Container maxWidth='md'>
    <Paper className={props.classes.root} square={true}>
      <Form>
        <InputLabel htmlFor='email'>Email</InputLabel>
        <Field
          name='email'
          type='text'
          placeholder='Enter your email'
          component={TextField}
          variant='outlined'
          margin="dense" />
        <InputLabel htmlFor='firstName'>First Name</InputLabel>
        <Field
          name='firstName'
          type='text'
          placeholder='Enter your first name'
          component={TextField}
          variant='outlined'
          margin="dense" />
        <InputLabel htmlFor='lastName'>Last Name</InputLabel>
        <Field
          name='lastName'
          type='text'
          placeholder='Enter your last name'
          component={TextField}
          variant='outlined'
          margin="dense" />
        <InputLabel htmlFor='profileImage'>Profile Image</InputLabel>
        <Field
          component={UploadImageField}
          name='profileImage' />
        <InputLabel htmlFor='biography'>About You</InputLabel>
        <Field
          name='biography'
          type='text'
          placeholder='Enter a short biography'
          component={TextField}
          variant='outlined'
          multiline
          rows='5'
          rowsMax='5'
          fullWidth
          margin="dense" />
        <InputLabel htmlFor='professionalTitle'>Professional Title</InputLabel>
        <Field
          name='professionalTitle'
          type='text'
          placeholder='Enter your job title'
          component={TextField}
          variant='outlined'
          margin="dense" />
        <InputLabel htmlFor='affiliatedOrganisation'>Affiliated Organisation</InputLabel>
        <Field
          name='affiliatedOrganisation'
          type='text'
          placeholder='Enter your affiliated organisation'
          component={TextField}
          variant='outlined'
          margin="dense" />
        <br />
        <Button
          type='submit'>
          <Save />
          Save
          </Button>
      </Form>
    </Paper>
  </Container>
  </Container>
);


export default withStyles(styles, { withTheme: true })(CreatorApplicationForm);
