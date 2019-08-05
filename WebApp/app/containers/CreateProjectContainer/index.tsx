/**
 *
 * CreateProjectContainer
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, Dispatch } from 'redux';

// import injectSaga from 'utils/injectSaga';
// import injectReducer from 'utils/injectReducer';
// import reducer from './reducer';
// import saga from './saga';
import makeSelectCreateProjectContainer from './selectors';
import ProjectCreationForm_About from 'components/ProjectCreationForm_About';
import { Formik } from 'formik';
import ProjectCreationForm_Background from 'components/ProjectCreationForm_Background';
import ProjectCreationForm_Campaign from 'components/ProjectCreationForm_Campaign';

interface OwnProps { }

interface DispatchProps { }

interface StateProps { }

type Props = StateProps & DispatchProps & OwnProps;

class CreateProjectContainer extends React.Component<Props> {
  public render() {
    const { } = this.props;

    return (
      <Fragment>
        <Formik
          initialValues={{
            title: '',
            abstract: '',
            featuredImage: ''
          }}
          // validationSchema={CreatorApplicationSchema}
          onSubmit={(values, actions) => {
            // onSubmitCreatorApplication(values);
          }}
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
          // validationSchema={CreatorApplicationSchema}
          onSubmit={(values, actions) => {
            // onSubmitCreatorApplication(values);
          }}
          render={({ values }) =>
            <ProjectCreationForm_Background collaborators={values.collaborators}></ProjectCreationForm_Background>
          }
        />
                <Formik
          initialValues={{
            context: '',
            approach: '',
            researchPhases: [
              {
                fullName: '',
                professionalTitle: '',
                affiliatedOrganisation: ''
              }
            ],
          }}
          // validationSchema={CreatorApplicationSchema}
          onSubmit={(values, actions) => {
            // onSubmitCreatorApplication(values);
          }}
          render={({ values }) =>
            <ProjectCreationForm_Campaign researchPhases={values.researchPhases}></ProjectCreationForm_Campaign>
          }
        />
      </Fragment>
    );
  }
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
