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
import { fileSizeValidation, MAX_FILE_SIZE, fileTypeValidation, SUPPORTED_IMAGE_FORMATS } from 'utils/fileValidationHelpers';


interface OwnProps { }
interface DispatchProps {
  onSubmitProject(data: ProjectData): void;
}
interface StateProps { }

type Props = StateProps & DispatchProps & OwnProps;

const CreateProjectContainer: React.FunctionComponent<Props> = ({ onSubmitProject }: Props) => {
  const CreateProjectSchema = Yup.object().shape({
    title: Yup.string().max(120, 'Project title is too long').required('Project title is required'),
    abstract: Yup.string().max(2000, 'Abstract is too long').required('Abstract is required'),
    featuredImage: Yup.mixed().required()
      .test('fileSize', 'Maximum file size of 10MB exceeded', file => fileSizeValidation(file, MAX_FILE_SIZE))
      .test('fileType', 'Please supply an image file', file => fileTypeValidation(file, SUPPORTED_IMAGE_FORMATS)),
    organisationImage: Yup.mixed().required()
      .test('fileSize', 'Maximum file size of 10MB exceeded', file => fileSizeValidation(file, MAX_FILE_SIZE))
      .test('fileType', 'Please supply an image file', file => fileTypeValidation(file, SUPPORTED_IMAGE_FORMATS)),
    researchPhases: Yup.array()
      .min(1, 'Projects must have at least 1 phase')
      .max(5, 'Projects must have at most 5 phases')
      .of(
        Yup.object().shape({
          title: Yup.string().max(120, 'Title is too long').required('Title is required'),
          description: Yup.string().max(2000, 'Description is too long').required('Description is required'),
          result: Yup.string().max(2000, 'Result is too long').required('Result is required'),
          fundingGoal: Yup.number().positive('Funding goal has to be greater than 0').required('Funding goal is required'),
          duration: Yup.number().positive('Phase duration has to be greater than 0').max(4, 'Phase duration can not be greater than 4 months').required('Duration is required'),
        })
      ),
    context: Yup.string().max(2000, 'Context is too long').required('Context is required'),
    approach: Yup.string().max(2000, 'Approach is too long').required('Approach is required'),
    collaborators: Yup.array().of(
      Yup.object().shape({
        fullName: Yup.string().max(70, 'Name is too long').required('Full name is required'),
        professionalTitle: Yup.string().max(70, 'Title is too long').required('Title is required'),
        affiliatedOrganisation: Yup.string().max(120, 'Organisation is too long').required('Organisation is required'),
      }),
    ),
  });

  return (
    <Formik
      initialValues={{
        title: '',
        abstract: '',
        featuredImage: '',
        organisationImage: '',
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
