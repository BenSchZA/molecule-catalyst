/**
 *
 * CreateProjectContainer
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, Dispatch } from 'redux';
import makeSelectCreateProjectContainer from './selectors';
import ProjectCreationForm from 'components/ProjectCreationForm';
import { Formik } from 'formik';
import injectSaga from 'utils/injectSaga';
import saga from './saga';
import { ProjectData } from './types';
import * as actions from './actions';
import * as Yup from 'yup';
import { fileSizeValidation, MAX_FILE_SIZE, fileTypeValidation, SUPPORTED_IMAGE_FORMATS } from 'fileManagement';

interface OwnProps { }
interface DispatchProps {
  onSubmitProject(data: ProjectData): void;
}
interface StateProps { }

type Props = StateProps & DispatchProps & OwnProps;

const CreateProjectContainer: React.FunctionComponent<Props> = ({ onSubmitProject }: Props) => {
  const CreateProjectSchema = Yup.object().shape({
    title: Yup.string().required(),
    abstract: Yup.string().required(),
    featuredImage: Yup.mixed()
      .test('fileSize', 'Maximum file size of 10MB exceeded', file => fileSizeValidation(file, MAX_FILE_SIZE))
      .test('fileType', 'Please supply an image file', file => fileTypeValidation(file, SUPPORTED_IMAGE_FORMATS)),
    researchPhases: Yup.array().of(
      Yup.object().shape({
        title: Yup.string().required(),
        description: Yup.string().required(),
        result: Yup.string().required(),
        fundingGoal: Yup.number().required(),
        duration: Yup.number().required(),
      })
    ),
    context: Yup.string().required(),
    approach: Yup.string().required(),
    collaborators: Yup.array().of(
      Yup.object().shape({
        fullName: Yup.string().required(),
        professionalTitle: Yup.string().required(),
        affiliatedOrganisation: Yup.string().required(),
      }),
    ),
  });

  return (
    <Formik
      initialValues={{
        title: '',
        abstract: '',
        featuredImage: '',
        researchPhases: [{
          title: '',
          description: '',
          result: '',
          fundingGoal: 0,
          duration: 0
        }],
        context: '',
        approach: '',
        collaborators: [{
          fullName: '',
          professionalTitle: '',
          affiliatedOrganisation: ''
        }],
      }}
      validationSchema={CreateProjectSchema}
      onSubmit={(values, actions) => {
        onSubmitProject(values);
      }}
      render={({ values }) =>
        <ProjectCreationForm values={values} />
      }
    />
  );
};

const mapStateToProps = createStructuredSelector({
  createProjectContainer: makeSelectCreateProjectContainer(),
});

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => ({
  onSubmitProject: (data: ProjectData) => dispatch(actions.submitProject(data)),
})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga<OwnProps>({
  key: 'createProjectContainer',
  saga: saga,
});

export default compose(
  withSaga,
  withConnect,
)(CreateProjectContainer);
