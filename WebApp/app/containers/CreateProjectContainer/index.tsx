/**
 *
 * CreateProjectContainer
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, Dispatch } from 'redux';
import makeSelectCreateProjectContainer from './selectors';
import ProjectCreationForm_About from 'components/ProjectCreationForm_About';
import { Formik } from 'formik';
import ProjectCreationForm_Background from 'components/ProjectCreationForm_Background';
import ProjectCreationForm_Campaign from 'components/ProjectCreationForm_Campaign';
import { Collaborator, ResearchPhase } from './types';

interface OwnProps { }
interface DispatchProps { }
interface StateProps { 
  application: {
    title?: string,
    abstract?: string,
    featuredImage?: string,
    context?: string,
    approach?: string,
    collaborators?: Collaborator[],
    campaignTitle?: string,
    campaignDescription?: string,
    researchPhases?: ResearchPhase[],
    status?: number,
  } | undefined
}

type Props = StateProps & DispatchProps & OwnProps;

const CreateProjectContainer: React.FunctionComponent<Props> = ({}: Props) => {
  return (
    <Fragment>
      <Formik
        initialValues={{
          title: '',
          abstract: '',
          featuredImage: ''
        }}
        onSubmit={(values, actions) => {}}
        render={() =>
          <ProjectCreationForm_About></ProjectCreationForm_About>
        }
      />
      <Formik
        initialValues={{
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
        }}
        render={({ values }) =>
          <ProjectCreationForm_Background collaborators={values.collaborators}></ProjectCreationForm_Background>
        }
      />
      <Formik
        initialValues={{
          campaignTitle: '',
          campaignDescription: '',
          researchPhases: [
            {
              title: '',
              description: '',
              result: '',
              fundingGoal: '',
              duration: ''
            }
          ],
        }}
        onSubmit={(values, actions) => {}}
        render={({ values }) =>
          <ProjectCreationForm_Campaign researchPhases={values.researchPhases}></ProjectCreationForm_Campaign>
        }
      />
    </Fragment>
  );
};

const mapStateToProps = createStructuredSelector({
  createProjectContainer: makeSelectCreateProjectContainer(),
});

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

// Remember to add the key to ./app/types/index.d.ts ApplicationRootState
// <OwnProps> restricts access to the HOC's other props. This component must not do anything with reducer hoc
// const withReducer = injectReducer<OwnProps>({
//   key: 'createProjectContainer',
//   reducer: reducer,
// });
// // <OwnProps> restricts access to the HOC's other props. This component must not do anything with saga hoc
// const withSaga = injectSaga<OwnProps>({
//   key: 'createProjectContainer',
//   saga: saga,
// });

export default compose(
  // withReducer,
  // withSaga,
  withConnect,
)(CreateProjectContainer);
