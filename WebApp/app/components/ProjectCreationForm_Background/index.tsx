/**
 *
 * ProjectCreationForm
 *
 */

import React from 'react';
import { Theme, createStyles, WithStyles, Paper, Typography, InputLabel, Container, Divider, Grid, Button, withStyles } from '@material-ui/core';
import { Form, Field, FieldArray } from 'formik';
import { TextField } from 'formik-material-ui';
import { colors } from 'theme';
import { Add, Remove } from '@material-ui/icons';

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

interface OwnProps extends WithStyles<typeof styles> {
  collaborators: any[],
}

const ProjectCreationForm_Background: React.SFC<OwnProps> = ({classes, collaborators}: OwnProps) => (
  <Container className={classes.containerRoot}>
    <Paper className={classes.banner} square={true} elevation={0}>
      <Typography variant='h3' className={classes.heading}>Background</Typography>
      <Typography variant='body1' className={classes.heading}>
        Describe your research project in more detail.
        Why it is worth pursuing, and what you are planning for your project as a whole.
      </Typography>
      <Typography variant='body2' className={classes.heading}>
        Try keep your explanations as simple as possible. <br />
        Include interesting pictures and links to relevant academic publications.
      </Typography>
      <Divider className={classes.divider} variant='middle' />
    </Paper>
    <Container maxWidth='md'>
      <Paper className={classes.root} square={true}>
        <Form>
          <InputLabel htmlFor='context'>Context and Significance</InputLabel>
          <InputLabel htmlFor='context' shrink>
            Explain the origins of this research idea and what inspired you to pursue it.
            Describe why it is worth working on, and why people should donate money for your initiative.
          </InputLabel>
          <Field
            name='context'
            type='text'
            placeholder='What is the context and significance of your project? Include links and pictures to support your explanations.'
            component={TextField}
            variant='filled'
            multiline
            rows='5'
            rowsMax='5'
            fullWidth
            margin="dense" />
          <InputLabel htmlFor='approach'>Approach</InputLabel>
          <InputLabel htmlFor='approach' shrink>
            Describe the theory behind your approach, the design of your studies/experiments, and how you plan to gather
            and evaluate all data and results.
          </InputLabel>
          <Field
            name='approach'
            type='text'
            placeholder='How do you plan to approach your project? Include links and pictures to support your justifications.'
            component={TextField}
            variant='filled'
            multiline
            rows='5'
            rowsMax='5'
            fullWidth
            margin="dense" />
          <InputLabel htmlFor='collaborators'>Collaborators</InputLabel>
          <InputLabel htmlFor='collaborators' shrink>
            Add up to 5 people who support your research project.
          </InputLabel>
          <FieldArray
            name="collaborators"
            render={arrayHelpers => (
              <div>
                {collaborators && collaborators.length > 0 ? (
                  collaborators.map((collaborator, index) => (
                    <div>
                      {index == 0 && collaborators.length <= 4 ?
                        <Button size="small" onClick={() => {
                          arrayHelpers.insert(index, {
                            fullName: '',
                            professionalTitle: '',
                            affiliatedOrganisation: ''
                          })
                        }}><Add /></Button> : <div />
                      }
                      {collaborators.length > 1 ?
                          <Button size="small" onClick={() => arrayHelpers.remove(index)}><Remove /></Button> : <div />
                      }
                      <Grid container key={index}>
                        <Grid item xs={6}>
                          <Field
                            name={`collaborators[${index}.fullName]`}
                            type='text'
                            placeholder='Full Name'
                            component={TextField}
                            variant='filled'
                            fullWidth
                            margin="dense" />
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            name={`collaborators[${index}.professionalTitle]`}
                            type='text'
                            placeholder='Professional Title'
                            component={TextField}
                            variant='filled'
                            fullWidth
                            margin="dense" />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            name={`collaborators[${index}.affiliatedOrganisation]`}
                            type='text'
                            placeholder='Affiliated organisation'
                            component={TextField}
                            variant='filled'
                            fullWidth
                            margin="dense" />
                        </Grid>
                      </Grid>
                    </div>
                  ))
                ) : <div />}
              </div>
            )} />
        </Form>
      </Paper>
    </Container>
  </Container>
);

export default withStyles(styles, { withTheme: true })(ProjectCreationForm_Background);
