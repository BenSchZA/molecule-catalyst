/**
 *
 * ProjectCreationForm
 *
 */

import React from 'react';
import { Theme, createStyles, withStyles, WithStyles, Paper, Typography, InputLabel, Container, Divider } from '@material-ui/core';
import { Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import UploadImageField from 'components/UploadImageField';
import { colors } from 'theme';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: '8px',
      marginTop: '16px',
    },
    containerRoot: {
      paddingBottom: '24px'
    },
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
    divider: {}
  });

interface OwnProps extends WithStyles<typeof styles> { }

const ProjectCreationForm_About: React.SFC<OwnProps> = (props: OwnProps) => (
  <Container className={props.classes.containerRoot}>
    <Paper className={props.classes.banner} square={true} elevation={0}>
      <Typography variant='h3' className={props.classes.heading}>About</Typography>
      <Typography variant='body1' className={props.classes.heading}>
        Here you can provide a basic overview about the scientific research you want to get funding for.
      </Typography>
      <Divider className={props.classes.divider} variant='middle' />
    </Paper>
    <Container maxWidth='md'>
      <Paper className={props.classes.root} square={true}>
        <Form>
          <InputLabel htmlFor='title'>Title</InputLabel>
          <InputLabel htmlFor='title' shrink>Write a clear, brief title that helps people quickly understand the gist of your project.</InputLabel>
          <Field
            name='title'
            type='text'
            placeholder='Enter a project title'
            component={TextField}
            variant='filled'
            margin="dense" />
          <InputLabel htmlFor='abstract'>Abstract</InputLabel>
          <InputLabel htmlFor='abstract' shrink>Provide a short summary of your research project.</InputLabel>
          <Field
            name='abstract'
            type='text'
            placeholder='Enter a project abstract'
            component={TextField}
            variant='filled'
            multiline
            rows='5'
            rowsMax='5'
            fullWidth
            margin="dense" />
          <InputLabel htmlFor='featuredImage'>Featured Image</InputLabel>
          <InputLabel htmlFor='featuredImage' shrink>Upload a relevant visualization that will be used to represent your project across the platform.</InputLabel>
          <Field
            component={UploadImageField}
            name='featuredImage' />
        </Form>
      </Paper>
    </Container>
  </Container>
);

export default withStyles(styles, { withTheme: true })(ProjectCreationForm_About);
