/**
 *
 * LoginPage
 *
 * Simple connect wrapper to wire up the form with the dispatch(Login) action
 */

import LoginForm from 'components/LoginForm';
import { login } from 'domain/authentication/actions';
import { Formik } from 'formik';
import React, { } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import * as Yup from 'yup';
import { ApplicationRootState } from 'types';
import reducer from './reducer';
import injectReducer from 'utils/injectReducer';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required('Required'),
  password: Yup.string()
    .min(1, 'Too Short!')
    .max(25, 'Too Long!')
    .required('Required'),
});

interface OwnProps { }

interface StateProps {
  error: string;
  currentlySending: boolean;
}

interface DispatchProps {
  onSubmitLogin: (data) => void;
}

type Props = StateProps & DispatchProps & OwnProps;

function LoginPage(props: Props) {
  const { onSubmitLogin, error, currentlySending } = props;

  // TODO Add schema validation here
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      isInitialValid={false}
      validationSchema={LoginSchema}
      onSubmit={(values, actions) => {
        onSubmitLogin(values);
        actions.setSubmitting(currentlySending);
      }}
      render={({ submitForm }) => (
        <LoginForm
          error={error}
          isSubmitting={currentlySending}
          submitForm={submitForm} />
      )}
    />
  );
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onSubmitLogin: (data) => {
    dispatch(login.request(data));
  },
})

const mapStateToProps = (state: ApplicationRootState) => ({
  error: state.loginPage.error,
  currentlySending: state.app.currentlySending,
});

const withReducer = injectReducer<OwnProps>({ key: 'loginPage', reducer: reducer })
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withReducer,
  withConnect,
)(LoginPage);
