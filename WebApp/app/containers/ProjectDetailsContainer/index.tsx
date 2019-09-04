/**
 *
 * ProjectDetailsContainer
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

import injectSaga from 'utils/injectSaga';
import saga from './saga';
import { RouteComponentProps } from 'react-router-dom';
import ProjectDetails from 'components/ProjectDetails';
import { Project } from 'domain/projects/types';
import { RESTART_ON_REMOUNT } from 'utils/constants';
import { ApplicationRootState } from 'types';
import { Formik, FormikProps, FormikValues } from 'formik';
import * as Yup from 'yup';
import { supportProject } from 'domain/projects/actions';

interface RouteParams {
  projectId: string;
}

interface OwnProps extends RouteComponentProps<RouteParams>,
React.Props<RouteParams> { }

interface DispatchProps {
}

interface StateProps {
  project: Project,
  daiBalance: number,
  contribution: number,
  supportProject(projectId: string, contribution: number): void,
}

type Props = StateProps & DispatchProps & OwnProps;

const ProjectDetailsContainer: React.FunctionComponent<Props> = (props: Props) => {

  const onSubmit = (values, { setSubmitting }) => {
    console.log("Submit");
    props.supportProject(props.project.id, values.contribution);
    // setTimeout(() => {
    //   alert(JSON.stringify(values, null, 2));
    //   setSubmitting(false);
    // }, 1000);
  };

  const validationSchema = Yup.object().shape({
    contribution: Yup.number().positive('Invalid value').min(1).required('Required').test('Check funds', 'Not enough funds', (value) => {
      return value <= props.daiBalance;
    }),
  });

  return (
    <div>
      <Formik
        initialValues={{ contribution: 0 }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        >
        {(formikProps: FormikProps<FormikValues>) => (
          <ProjectDetails
            project={props.project}
            daiBalance={props.daiBalance}
            formikProps={formikProps}
          />
        )}
      </Formik>
    </div>
  );
};

const mapStateToProps = (state: ApplicationRootState, props) => ({
  project: state.projects[props.match.params.projectId],
  daiBalance: state.authentication.daiBalance,
});

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => ({
  supportProject: (projectId, contribution) => dispatch(supportProject.request({ projectId: projectId, contribution: contribution })),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga<OwnProps>({
  key: 'projectDetailsContainer',
  saga: saga,
  mode: RESTART_ON_REMOUNT
});

export default compose(
  withSaga,
  withConnect,
)(ProjectDetailsContainer);
