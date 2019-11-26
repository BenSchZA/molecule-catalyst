/**
 *
 * AdminUserEditContainer
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import { ApplicationRootState } from 'types';
import { RouteComponentProps } from 'react-router-dom';
import { Formik } from 'formik';
import CreatorApplicationForm from 'components/CreatorApplicationForm';
import * as Yup from 'yup';
import { fileSizeValidation, fileTypeValidation, MAX_FILE_SIZE, SUPPORTED_IMAGE_FORMATS } from 'utils/fileValidationHelpers';

interface RouteParams {
  userId: string;
}

interface OwnProps extends RouteComponentProps<RouteParams>,
  React.Props<RouteParams> { }

interface DispatchProps { }

interface StateProps { 
  user: any,
}

type Props = StateProps & DispatchProps & OwnProps;

const AdminUserEditContainer: React.FunctionComponent<Props> = ({user}: Props) => {
  const CreatorApplicationSchema = Yup.object().shape({
    email: Yup.string().email(),
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    profileImage: Yup.mixed()
      .test('fileSize', 'Maximum file size of 10MB exceeded', file => fileSizeValidation(file, MAX_FILE_SIZE))
      .test('fileType', 'Please supply an image file', file => fileTypeValidation(file, SUPPORTED_IMAGE_FORMATS)),
    biography: Yup.string().required(),
    professionalTitle: Yup.string().required(),
    affiliatedOrganisation: Yup.string().required(),
  });

  return <Formik
    initialValues={{
      ...user
    }}
    validationSchema={CreatorApplicationSchema}
    onSubmit={(values, actions) => {
      console.log(values);
    }}
    render={() =>
      <CreatorApplicationForm />
    }
  />;
};

const mapStateToProps = (state: ApplicationRootState, props: OwnProps) => ({
  user: (state.adminDashboard && state.adminDashboard.users) ?
    state.adminDashboard.users[props.match.params.userId] :
    {
      id: '',
      type: 0,
      ethAddress: '0x',
      createdAt: new Date(),
    },
})

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => {
  return {
    dispatch: dispatch,
  };
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
)(AdminUserEditContainer);
