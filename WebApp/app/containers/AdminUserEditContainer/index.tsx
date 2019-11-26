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
import { UserData } from './types';
import { updateUserAction } from './actions';
import injectSaga from 'utils/injectSaga';
import saga from './saga';

interface RouteParams {
  userId: string;
}

interface OwnProps extends RouteComponentProps<RouteParams>,
  React.Props<RouteParams> { }

interface DispatchProps { 
  updateUser(data: UserData): void
}

interface StateProps { 
  user: any,
}

type Props = StateProps & DispatchProps & OwnProps;

const AdminUserEditContainer: React.FunctionComponent<Props> = ({user, updateUser}: Props) => {
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
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage,
      biography: user.biography,
      professionalTitle: user.professionalTitle,
      affiliatedOrganisation: user.affiliatedOrganisation,
    }}
    validationSchema={CreatorApplicationSchema}
    onSubmit={(values, actions) => {
      updateUser(values);
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
  props: OwnProps,
): DispatchProps => {
  return {
    updateUser: (data: UserData) => dispatch(updateUserAction.request({userId: props.match.params.userId, data})),
  };
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga<OwnProps>({
  key: 'adminUserEditContainer',
  saga: saga,
});

export default compose(
  withSaga,
  withConnect,
)(AdminUserEditContainer);
