import {
  Button,
  createStyles,
  FormControl,
  LinearProgress,
  Paper,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import { Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';
import React, { Fragment } from 'react';

const styles = ({ spacing, breakpoints }: Theme) => createStyles({
  layout: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: spacing(3),
    marginRight: spacing(3),
    [breakpoints.up(400 + spacing(6))]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${spacing(2)}px ${spacing(3)}px ${spacing(3)}px`,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: spacing(1),
  },
  submit: {
    marginTop: spacing(3),
  },
});

interface Props extends WithStyles<typeof styles> {
  error: string;
  isSubmitting: boolean;
  submitForm(): void;
}

const SignUpForm: React.SFC<Props> = (props: Props) => {
  const { classes, isSubmitting, submitForm, error } = props;
  return (
    <Fragment>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h3">Register</Typography>
          <Form className={classes.form}>
            <FormControl margin="normal" required fullWidth>
              <Field
                name="email"
                type="email"
                label="E-mail"
                component={TextField} />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <Field
                name="password"
                type="password"
                label="Password"
                component={TextField} />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <Field
                name="retypePassword"
                type="password"
                label="Retype Password"
                component={TextField} />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <Field
                name="firstName"
                type="text"
                label="First Name"
                component={TextField} />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <Field
                name="lastName"
                type="text"
                label="Last Name"
                component={TextField} />
            </FormControl>
            {error && <Typography variant="body1">{error}</Typography>}
            {isSubmitting && <LinearProgress />}
            <br />
            <Button
              variant="contained"
              className={classes.submit}
              color="primary"
              disabled={isSubmitting}
              fullWidth
              onClick={submitForm}>
              Submit
              </Button>
          </Form>
        </Paper>
      </main>
    </Fragment>
  );
};

export default withStyles(styles, { withTheme: true })(SignUpForm);
