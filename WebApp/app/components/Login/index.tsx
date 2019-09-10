import { TextField } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import LockIcon from '@material-ui/icons/LockOutlined';
import {Field, Form} from 'formik';
import React, { Fragment } from 'react';

import { FormControl, LinearProgress } from '@material-ui/core';
import { colors } from 'theme';

const styles = ({ palette, spacing, breakpoints }: Theme) => createStyles({
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
    marginTop: spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${spacing(2)}px ${spacing(3)}px ${spacing(3)}px`,
  },
  avatar: {
    margin: spacing(1),
    backgroundColor: palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: spacing(1),
  },
  submit: {
    marginTop: spacing(3),
  },
  body1: {
    fontWeight: 'bold',
    color: colors.textBlack,
    paddingBottom: '16px',
    paddingLeft: '8px',
    paddingRight: '8px'
  }
});

interface Props extends WithStyles<typeof styles> {
  error: any;
  isSubmitting: any;
  submitForm: any;
  innerRef: any;
}

class LoginForm extends React.Component<Props> {
  public render() {
    const { classes, isSubmitting, submitForm, error } = this.props;

    return (
      <Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
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
              {error && <Typography variant="body1">{error}</Typography>}
              {isSubmitting && <LinearProgress />}
              <br />
              <Button
                onClick={submitForm}
                disabled={isSubmitting}
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}>
                Sign in
              </Button>
            </Form>
          </Paper>
        </main>
      </Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(LoginForm);
