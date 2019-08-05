/**
 *
 * ProjectCreationForm
 *
 */

import React from 'react';
import { Theme, createStyles, WithStyles, Paper, Typography, InputLabel, Container, Divider, Grid, Button, withStyles } from '@material-ui/core';
import { Form, Field, FieldArray } from 'formik';
import { TextField } from 'formik-material-ui';
import {colors} from 'theme';
import { Add, Remove } from '@material-ui/icons';

const styles = (theme: Theme) =>
  createStyles({
    root:{
      padding: '8px',
      marginTop: '16px',
    },
    containerRoot: {
      paddingBottom: '24px'
    },
    banner:{
      paddingBottom: '18px',
      backgroundColor: colors.lightGrey,
      alignItems: 'center'
    },
    heading:{
      textAlign: 'center',
      maxWidth: '40vw',
      minWidth: '300px',
      margin: 'auto'
    },
    divider: {},
    gridItem: {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column',
    }
  });

interface Props extends WithStyles<typeof styles> {
  researchPhases: any[],
}

class ProjectCreationForm_Campaign extends React.Component<Props> {
  public render() {
    const { classes, researchPhases } = this.props;

    return (
      <Container className={classes.containerRoot}>
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
          <Divider className={classes.divider} variant='middle'/>
        </Paper>
        <Container maxWidth='md'>
          <Paper className={classes.root} square={true}>
            <Typography variant='h5'>Research Phases and Campaign Settings</Typography>
            <Typography variant='h4' color='primary'>Phase 01</Typography>
            <Form>
              <InputLabel htmlFor='title'>Title</InputLabel>
              <InputLabel htmlFor='title' shrink>
                Write a brief title for this specific research phase.
              </InputLabel>
              <Field
                name='title'
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
                name='description'
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
                name='result'
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
                    name='fundingGoal'
                    type='text'
                    placeholder='e.g. $10,000'
                    component={TextField}
                    variant='filled'
                    fullWidth
                    margin="dense" />
                </Grid>
                <Grid item xs={6} className={classes.gridItem}>
                  <InputLabel htmlFor='duration'>Duration</InputLabel>
                  <InputLabel htmlFor='duration' shrink>
                    Time needed to finish this phase.
                  </InputLabel>
                  <Field
                    name='duration'
                    type='text'
                    placeholder='(max. of 4 months)'
                    component={TextField}
                    variant='filled'
                    fullWidth
                    margin="dense" />
                </Grid>
              </Grid>
            </Form>
          </Paper>
        </Container>
      </Container>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ProjectCreationForm_Campaign);
