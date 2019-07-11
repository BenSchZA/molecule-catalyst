/**
 *
 * Sign Up Page
 *
 */

import SignUpForm from 'components/SignUpForm';
import { signup } from 'domain/authentication/actions';
import { Formik } from 'formik';
import React from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import * as Yup from 'yup';
import { ApplicationRootState } from 'types';
import reducer from './reducer';
import injectReducer from 'utils/injectReducer';

const SignUpSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  password: Yup.string()
    .min(6, 'Too Short!')
    .max(25, 'Too Long!')
    .required('Required'),
  retypePassword: Yup.string()
    .required('Confirm your password')
    .oneOf([Yup.ref('password')], 'Password does not match'),
  firstName: Yup.string()
    .required('Required'),
  lastName: Yup.string()
    .required('Required'),
});

interface OwnProps { }

interface StateProps {
  error: string;
  currentlySending: boolean;
}

interface DispatchProps {
  onSubmitSignUp: (data) => void;
}

type Props = StateProps & DispatchProps & OwnProps;

const SignUpPage = (props: Props) => {
  const { onSubmitSignUp, error, currentlySending } = props;

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        retypePassword: '',
        firstName: '',
        lastName: ''
      }}
      validationSchema={SignUpSchema}
      onSubmit={(values, actions) => {
        onSubmitSignUp(values);
        actions.setSubmitting(currentlySending);
      }}
      render={({ submitForm }) =>
        <SignUpForm
          error={error}
          isSubmitting={currentlySending}
          submitForm={submitForm} />}
    />
  );
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onSubmitSignUp: (data) => {
    dispatch(signup.request(data));
  },
})

const mapStateToProps = (state: ApplicationRootState) => ({
  error: state.signupPage.error,
  currentlySending: state.app.currentlySending,
});

const withReducer = injectReducer<OwnProps>({ key: 'signupPage', reducer: reducer })
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withReducer,
  withConnect,
)(SignUpPage);
