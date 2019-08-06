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
import ProjectCreationForm_About from 'components/ProjectCreationForm_About';
import { Formik, Form } from 'formik';
import ProjectCreationForm_Background from 'components/ProjectCreationForm_Background';
import ProjectCreationForm_Campaign from 'components/ProjectCreationForm_Campaign';
import injectSaga from 'utils/injectSaga';
import saga from './saga';
import { ProjectData } from './types';
import * as actions from './actions';
import { Button } from '@material-ui/core';


interface OwnProps { }
interface DispatchProps {
  onSubmitProject(data: ProjectData): void;
}
interface StateProps { }

type Props = StateProps & DispatchProps & OwnProps;

const CreateProjectContainer: React.FunctionComponent<Props> = ({ onSubmitProject }: Props) => {
  return (
    <Formik
      initialValues={{
        title: '',
        abstract: '',
        featuredImage: '',
        researchPhases: [
          {
            title: '',
            description: '',
            result: '',
            fundingGoal: 0,
            duration: 0
          }
        ],
        context: '',
        approach: '',
        collaborators: [
          {
            fullName: '',
            professionalTitle: '',
            affiliatedOrganisation: ''
          }
        ],
      }}
      onSubmit={(values, actions) => {
        onSubmitProject(values);
      }}
      render={({ values }) =>
        <Form>
          <ProjectCreationForm_About />
          <ProjectCreationForm_Background collaborators={values.collaborators} />
          <ProjectCreationForm_Campaign researchPhases={values.researchPhases} />
          <Button type='submit'>Submit</Button>
        </Form>
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
