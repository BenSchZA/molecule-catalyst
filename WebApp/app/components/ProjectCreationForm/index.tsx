/**
 *
 * ProjectCreationForm
 *
 */

import React from 'react';
import { Theme, createStyles, withStyles, WithStyles, Paper, Typography, InputLabel, Container, Divider, Grid, Button } from '@material-ui/core';
import { Form, Field, FieldArray } from 'formik';
import { TextField } from 'formik-material-ui';
import UploadImageField from 'components/UploadImageField';
import { colors } from 'theme';
import { Remove, Add } from '@material-ui/icons';

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
    gridItem: {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column',
    },
    buttonBar: {
      textAlign: 'right',
    }
  });

interface OwnProps extends WithStyles<typeof styles> {
  values: any;
}

const ProjectCreationForm: React.FunctionComponent<OwnProps> = ({ classes, values }: OwnProps) => (
  <Container className={classes.containerRoot}>
    <Form>
      <Paper className={classes.banner} square={true} elevation={0}>
        <Typography variant='h3' className={classes.heading}>About</Typography>
        <Typography variant='body1' className={classes.heading}>
          Here you can provide a basic overview about the scientific research you want to get funding for.
      </Typography>
        <Divider variant='middle' />
      </Paper>
      <Container maxWidth='md'>
        <Paper className={classes.root} square={true}>
          <InputLabel htmlFor='title'>Title</InputLabel>
          <InputLabel htmlFor='title' shrink>Write a clear, brief title that helps people quickly understand the gist of your project.</InputLabel>
          <Field
            name='title'
            type='text'
            placeholder='Enter a project title'
            component={TextField}
            variant='filled'
            margin="dense"
            fullWidth />
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
        </Paper>
      </Container>
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
        <Divider variant='middle' />
      </Paper>
      <Container maxWidth='md'>
        <Paper className={classes.root} square={true}>
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
                {values.collaborators && values.collaborators.length > 0 ? (
                  values.collaborators.map((collaborator, index) => (
                    <div key={index}>
                      {index == 0 && values.collaborators.length <= 4 ?
                        <Button size="small" onClick={() => {
                          arrayHelpers.insert(values.collaborators.length, {
                            fullName: '',
                            professionalTitle: '',
                            affiliatedOrganisation: ''
                          })
                        }}><Add /></Button> : <div />
                      }
                      {values.collaborators.length > 1 ?
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
        </Paper>
      </Container>
      <Paper className={classes.banner} square={true} elevation={0}>
        <Typography variant='h3' className={classes.heading}>Campaign</Typography>
        <Typography variant='body1' className={classes.heading}>
          Now you can add your consecutive project phases that make up your campaign.
          Define your expected results, goal dates, and the amount of funding you need
          for each phase.
      </Typography>
        <Typography variant='body2' className={classes.heading}>
          We can assist you when choosing these parameters.
        For more information about fundraising campaigns on Molecule, <a href="">click here.</a>
        </Typography>
        <Divider variant='middle' />
      </Paper>
      <Container maxWidth='md'>
        <Paper className={classes.root} square={true}>
          <Typography variant='h5'>Research Phases and Campaign Settings</Typography>
          <FieldArray
            name="researchPhases"
            render={arrayHelpers => (
              <div>
                {values.researchPhases && values.researchPhases.length > 0 ? (
                  values.researchPhases.map((researchPhase, index) => (
                    <div key={index}>
                      {index == 0 && values.researchPhases.length <= 4 ?
                        <Button size="small" onClick={() => {
                          arrayHelpers.insert(values.researchPhases.length, {
                            title: '',
                            description: '',
                            result: '',
                            fundingGoal: '',
                            duration: ''
                          })
                        }}><Add /></Button> : <div />
                      }
                      {values.researchPhases.length > 1 ?
                        <Button size="small" onClick={() => arrayHelpers.remove(index)}><Remove /></Button> : <div />
                      }
                      <div key={index}>
                        <Typography variant='h4' color='primary'>Phase 0{index + 1}</Typography>
                        <InputLabel htmlFor='title'>Title</InputLabel>
                        <InputLabel htmlFor='title' shrink>
                          Write a brief title for this specific research phase.
                          </InputLabel>
                        <Field
                          name={`researchPhases[${index}.title]`}
                          type='text'
                          placeholder='Enter a project title.'
                          component={TextField}
                          variant='filled'
                          fullWidth
                          margin="dense" />
                        <InputLabel htmlFor='description'>Description</InputLabel>
                        <InputLabel htmlFor='description' shrink>
                          Write a brief description of the steps that are part of this specific research phase.
                          </InputLabel>
                        <Field
                          name={`researchPhases[${index}.description]`}
                          type='text'
                          placeholder='Enter a description.'
                          component={TextField}
                          variant='filled'
                          multiline
                          rows='5'
                          rowsMax='5'
                          fullWidth
                          margin="dense" />
                        <InputLabel htmlFor='result'>Result</InputLabel>
                        <InputLabel htmlFor='result' shrink>
                          What can you show to your backers after this phase has been completed?
                          (e.g. experimental data, report, ...)
                          </InputLabel>
                        <Field
                          name={`researchPhases[${index}.result]`}
                          type='text'
                          placeholder='Enter a result.'
                          component={TextField}
                          variant='filled'
                          fullWidth
                          margin="dense" />
                        <Grid container>
                          <Grid item xs={6} className={classes.gridItem}>
                            <InputLabel htmlFor='fundingGoal'>Funding Goal</InputLabel>
                            <InputLabel htmlFor='fundingGoal' shrink>
                              Amount of funding needed to complete this phase.
                            </InputLabel>
                            <Field
                              name={`researchPhases[${index}.fundingGoal]`}
                              type='number'
                              placeholder='e.g. $10,000'
                              component={TextField}
                              variant='filled'
                              fullWidth
                              margin="dense"
                              InputProps={{
                                inputProps: {
                                  min: 0,
                                },
                              }} />
                          </Grid>
                          <Grid item xs={6} className={classes.gridItem}>
                            <InputLabel htmlFor='duration'>Duration</InputLabel>
                            <InputLabel htmlFor='duration' shrink>
                              Time needed to finish this phase.
                              </InputLabel>
                            <Field
                              name={`researchPhases[${index}.duration]`}
                              type='number'
                              placeholder='(max. of 4 months)'
                              component={TextField}
                              variant='filled'
                              fullWidth
                              margin='dense'
                              InputProps={{
                                inputProps: {
                                  min: 0,
                                  max: 4
                                },
                              }} />
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  ))
                ) : <div />}
              </div>
            )} />
        </Paper>
      </Container>
      <Container maxWidth='md' className={classes.buttonBar}>
        <Button type='submit'>Create</Button>
      </Container>
    </Form>
  </Container>
);

export default withStyles(styles, { withTheme: true })(ProjectCreationForm);
