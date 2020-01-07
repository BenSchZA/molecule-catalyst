/**
 *
 * UserDetailsForm
 *
 */

import React from 'react';
import { Theme, createStyles, withStyles, WithStyles, Button, InputLabel } from '@material-ui/core';
import { Form, Field } from 'formik';
import { Save } from '@material-ui/icons';
import { TextField } from 'formik-material-ui';
import UploadImageTextField from 'components/UploadImageTextField';

const styles = (theme: Theme) =>
  createStyles({
    // JSS in CSS goes here
  });

interface OwnProps extends WithStyles<typeof styles> { }

const UserDetailsForm: React.FunctionComponent<OwnProps> = (
  props: OwnProps,
) => 
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
      component={UploadImageTextField}
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
  </Form>;

export default withStyles(styles, { withTheme: true })(UserDetailsForm);
