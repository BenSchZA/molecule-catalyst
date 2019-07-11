import { FormControl, LinearProgress } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import LockIcon from '@material-ui/icons/LockOutlined';
import { Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';
import React, { Fragment } from 'react';

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
  input: {
    style: "display:none",
  },
});

interface Props extends WithStyles<typeof styles> {
  error: string;
  isSubmitting: boolean;
  submitForm(): void;
}

const LoginForm: React.SFC<Props> = (props: Props) => {
  const { classes, isSubmitting, submitForm, error } = props;
  return (
    <Fragment>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
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
              autoFocus
              disabled={isSubmitting}
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}>
              Login
              </Button>
          </Form>
        </Paper>
      </main>
    </Fragment>
  );
};

export default withStyles(styles, { withTheme: true })(LoginForm);
