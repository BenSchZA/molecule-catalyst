/**
 *
 * ProjectDetailsContainer
 *
 */

import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import { RouteComponentProps } from 'react-router-dom';
import { Formik, FormikProps, FormikValues } from 'formik';
import * as Yup from 'yup';

import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import injectSaga from 'utils/injectSaga';
import saga from './saga';
import ProjectDetails from 'components/ProjectDetails';
import { Project } from 'domain/projects/types';
import { RESTART_ON_REMOUNT } from 'utils/constants';
import { ApplicationRootState } from 'types';
import { supportProject, withdrawHoldings } from 'domain/projects/actions';

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
  userAddress: string,
  contribution: number,
  txInProgress: boolean,
  supportProject(projectId: string, contribution: number): void,
  withdrawHoldings(projectId: string): void,
}

type Props = StateProps & DispatchProps & OwnProps;

const ProjectDetailsContainer: React.FunctionComponent<Props> = (props: Props) => {

  const [modal, setModal] = useState(0);

  const initialValues = modal == 0 ? { 
    contribution: 0,
  } : {};

  const onSubmit = modal == 0 ? (values) => {
    props.supportProject(props.project.id, values.contribution);
  } : (values) => {
    props.withdrawHoldings(props.project.id);
  };

  const validationSchema = modal == 0 ? Yup.object().shape({
    contribution: Yup.number()
      .positive('Invalid value')
      .min(1)
      .required('Required')
      .test('Check funds', 'Not enough funds', (value) => {
        return value <= props.daiBalance;
    }),
  }) : Yup.object().shape({});

  return (
    <div>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        >
        {(formikProps: FormikProps<FormikValues>) => (
          <ProjectDetails
            project={props.project}
            daiBalance={props.daiBalance}
            userAddress={props.userAddress}
            formikProps={formikProps}
            selectModal={setModal}
            txInProgress={props.txInProgress}
          />
        )}
      </Formik>
    </div>
  );
};

const mapStateToProps = (state: ApplicationRootState, props) => ({
  project: state.projects[props.match.params.projectId],
  daiBalance: state.authentication.daiBalance,
  userAddress: state.authentication.ethAddress,
  txInProgress: state.projectDetailsContainer.txInProgress
});

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => ({
  supportProject: (projectId, contribution) => dispatch(supportProject.request({ projectId: projectId, contribution: contribution })),
  withdrawHoldings: (projectId) => dispatch(withdrawHoldings.request(projectId)),
});

const withReducer = injectReducer<OwnProps>({
  key: 'projectDetailsContainer',
  reducer: reducer,
});

const withSaga = injectSaga<OwnProps>({
  key: 'projectDetailsContainer',
  saga: saga,
  mode: RESTART_ON_REMOUNT
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);


export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ProjectDetailsContainer);
