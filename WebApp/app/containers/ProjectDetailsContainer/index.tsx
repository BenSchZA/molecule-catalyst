/**
 *
 * ProjectDetailsContainer
 *
 */

import React, { useState } from 'react';
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
import { supportProject, withdrawHoldings } from 'domain/projects/actions';
import { ethers } from 'ethers';

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
  supportProject(projectId: string, contribution: number): void,
  withdrawHoldings(projectId: string): void,
}

type Props = StateProps & DispatchProps & OwnProps;

const ProjectDetailsContainer: React.FunctionComponent<Props> = (props: Props) => {
  const {project, userAddress} = props;

  const [modal, setModal] = useState(0);

  const initialValues = modal == 0 ? { 
    contribution: 0,
  } : {};

  const onSubmit = modal == 0 ? (values, { setSubmitting }) => {
    setSubmitting(true);
    props.supportProject(props.project.id, values.contribution);
    setSubmitting(false);
  } : (values, { setSubmitting }) => {
    setSubmitting(true);
    props.withdrawHoldings(props.project.id);
    setSubmitting(false);
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

  const holdingsValue = project && project.chainData && project.chainData.marketData
    ? Number(ethers.utils.formatEther(project.chainData.marketData.holdingsValue)) : 0;

  const contributionValue =
    userAddress &&
    project && 
    project.marketData && 
    project.marketData.netCost && 
    project.marketData.netCost[userAddress]
    ? Number(ethers.utils.formatEther(project.marketData.netCost[userAddress]))
    * Number(ethers.utils.formatEther(project.marketData.balances[userAddress])) : 0;

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
            holdingsValue={holdingsValue}
            contributionValue={contributionValue}
            formikProps={formikProps}
            selectModal={setModal}
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
});

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => ({
  supportProject: (projectId, contribution) => dispatch(supportProject.request({ projectId: projectId, contribution: contribution })),
  withdrawHoldings: (projectId) => dispatch(withdrawHoldings.request(projectId)),
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
