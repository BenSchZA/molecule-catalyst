import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import * as Yup from 'yup';
import isMongoId from 'validator/lib/isMongoId';
import { Formik } from 'formik';

import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import injectSaga from 'utils/injectSaga';
import saga from './saga';
import * as actions from './actions';
import { CreatorApplicationData } from './types';
import CreatorApplicationForm from 'components/CreatorApplicationForm';
import creatorApplicationState from './selectors';
import { RESTART_ON_REMOUNT } from 'utils/constants';
import { Typography, Button, Divider } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';
import * as qs from 'query-string';

interface OwnProps extends RouteComponentProps { }

interface DispatchProps {
  onSubmitCreatorApplication(data: Object): void;
  verifyEmail(token: string): void
}

export interface StateProps {
  application: {
    id?: string;
    user?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    profileImage?: string,
    biography?: string,
    professionalTitle?: string,
    affiliatedOrganisation?: string,
    emailVerified?: boolean,
    status?: number,
  } | undefined
}

type Props = StateProps & DispatchProps & OwnProps;

const MAX_FILE_SIZE = (1024 ** 2) * 10;
const SUPPORTED_IMAGE_FORMATS = [
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'image/png',
];

const fileSizeValidation = (file: File | string, maxSize: number): boolean => {
  try {
    if (file === undefined) { return true; }
    if (typeof file === "string") {
      return isMongoId(file);
    } else {
      return (file.size <= maxSize);
    }
  } catch (error) {
    return true;
  }
};

const fileTypeValidation = (file: File | string, types: Array<string>): boolean => {
  try {
    if (file === undefined) { return true; }
    if (typeof file === 'string') {
      return isMongoId(file);
    } else {
      return (types.includes(file.type));
    }
  } catch (error) {
    return true;
  }
}

const CreatorApplicationContainer: React.FunctionComponent<Props> = ({ onSubmitCreatorApplication, verifyEmail, application, location }: Props) => {
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

  if (application && application.id !== undefined) {
    if (application.status === 1) {
      if (location.search) {
        const parsed = qs.parse(location.search) as {token: string};
        return (
          <Fragment>
            <Typography variant='h2'>
            Almost there...
            </Typography>
            <Button variant='contained' onClick={() => verifyEmail(parsed.token)} >Click here to verify email</Button>
            <Divider variant='middle'/>
          </Fragment>
           
        )
      } else {
        return (
          <div>
          <Typography variant='h2'>
            Please check your email for a verification link
          </Typography>
           <Divider variant='middle'/>
           </div>
        )
      }
    } else if (application.status === 2) {
      return (
        <div>
          <Typography variant='h2'>
          Your request is being reviewed.
          </Typography>
           <Divider variant='middle' />
           </div>
      )
    } else if (application.status === 4) {
      return (  
        <div>  
          <Typography variant='h2'>
          We have reviewed your request and unfortunately are unable to approve it.
          </Typography>
        <Divider variant='middle' />
        </div>
      )
    } else {
      return null;
    }
  }
  else {
    return (
      <Formik
        initialValues={{
          email: '',
          firstName: '',
          lastName: '',
          profileImage: '',
          biography: '',
          professionalTitle: '',
          affiliatedOrganisation: '',
        }}
        validationSchema={CreatorApplicationSchema}
        onSubmit={(values, actions) => {
          onSubmitCreatorApplication(values);
        }}
        render={() =>
          <CreatorApplicationForm />
        }
      />
    );
  }
};

const mapStateToProps = state => creatorApplicationState(state);

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => ({
  onSubmitCreatorApplication: (data: CreatorApplicationData) => dispatch(actions.submitCreatorApplication.request(data)),
  verifyEmail: (token: string) => dispatch(actions.verifyEmail(token)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// // Remember to add the key to ./app/types/index.d.ts ApplicationRootState
// // <OwnProps> restricts access to the HOC's other props. This component must not do anything with reducer hoc
const withReducer = injectReducer<OwnProps>({
  key: 'creatorApplication',
  reducer: reducer,
});
const withSaga = injectSaga<OwnProps>({
  key: 'creatorApplication',
  saga: saga,
  mode: RESTART_ON_REMOUNT
});

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(CreatorApplicationContainer);
