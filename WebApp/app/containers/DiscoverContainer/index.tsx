/**
 *
 * DashboardContainer
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import selectDiscoverContainer from './selectors';
import { ApplicationRootState } from 'types';
import ProjectSearch from 'components/ProjectSearch';
import ProjectGrid from 'components/ProjectGrid';
import { RESTART_ON_REMOUNT } from 'utils/constants';

interface OwnProps {}

interface DispatchProps {
}

export interface StateProps {

}

type Props = StateProps & DispatchProps & OwnProps;

const DiscoverContainer: React.FunctionComponent<Props> = (props: Props) => (
  <Fragment>
    <ProjectSearch />
    <ProjectGrid />
  </Fragment>
)

const mapStateToProps = (state: ApplicationRootState) => selectDiscoverContainer(state);

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    dispatch: dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer<OwnProps>({
  key: 'discover',
  reducer: reducer,
});
const withSaga = injectSaga<OwnProps>({
  key: 'discover',
  saga: saga,
  mode: RESTART_ON_REMOUNT
});

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(DiscoverContainer);
