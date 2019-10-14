/**
 *
 * AdminProjectEditContainer
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import * as Yup from 'yup';

import injectSaga from 'utils/injectSaga';
import { fileSizeValidation, MAX_FILE_SIZE, fileTypeValidation, SUPPORTED_IMAGE_FORMATS } from 'utils/fileValidationHelpers';
import saga from './saga';
import { Project } from 'domain/projects/types';
import { RouteComponentProps } from 'react-router-dom';
import { ProjectData } from 'containers/CreateProjectContainer/types';
import { updateProject } from './actions';
import { Formik } from 'formik';
import ProjectCreationForm from 'components/ProjectCreationForm';
import { ApplicationRootState } from 'types';

interface RouteParams {
  projectId: string;
}

interface OwnProps extends RouteComponentProps<RouteParams>,
  React.Props<RouteParams> { }

interface DispatchProps {
  updateProject(projectId: string, data: ProjectData): void
}

interface StateProps {
  project: Project,
}

type Props = StateProps & DispatchProps & OwnProps;

const AdminProjectEditContainer: React.FunctionComponent<Props> = (
  { project, updateProject, match: { params: { projectId } } }: Props,
) => {
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
      initialValues={project}
      validationSchema={CreateProjectSchema}
      onSubmit={(values) => {
        updateProject(projectId, values);
      }}
      render={({ values }) =>
        <ProjectCreationForm values={values} />
      }
    />
  );
};

const mapStateToProps = (state: ApplicationRootState, props: OwnProps) => {
  console.log(state.projects);
  console.log(props.match.params.projectId);
  return {
    project: state.projects[props.match.params.projectId],
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => {
  return {
    updateProject: (id: string, data: ProjectData) => dispatch(updateProject.request({ projectId: id, data })),
  };
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// <OwnProps> restricts access to the HOC's other props. This component must not do anything with saga hoc
const withSaga = injectSaga<OwnProps>({
  key: 'adminProjectEditContainer',
  saga: saga,
});

export default compose(
  withSaga,
  withConnect,
)(AdminProjectEditContainer);
