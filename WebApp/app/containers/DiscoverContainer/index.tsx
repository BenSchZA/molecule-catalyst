/**
 *
 * DashboardContainer
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

import selectDashboardContainer from './selectors';
import Dashboard from 'components/Dashboard';
import * as AuthenticationActions from '../../domain/authentication/actions';
import { ApplicationRootState } from 'types';

interface OwnProps {}

interface DispatchProps {
}

export interface StateProps {

}

type Props = StateProps & DispatchProps & OwnProps;

const DiscoverContainer: React.SFC<Props> = (props: Props) => {
  return <Dashboard />;
};

const mapStateToProps = (state: ApplicationRootState) => selectDashboardContainer(state);

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    onConnect: () => dispatch(AuthenticationActions.authenticate.request()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
)(DiscoverContainer);
