/**
 *
 * DashboardContainer
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import selectDiscoverContainer from './selectors';
import { ApplicationRootState } from 'types';
import ProjectSearch from 'components/ProjectSearch';
import ProjectGrid from 'components/ProjectGrid';
import { setFilter } from './actions';
import { Project } from 'domain/projects/types';

interface OwnProps {}

interface DispatchProps {
  setFilter: (filter) => void
}

export interface StateProps {
  filter: {
    text: string,
    projectStatus: number,
  }
  projects: Array<Project>
}

type Props = StateProps & DispatchProps & OwnProps;

const DiscoverContainer: React.FunctionComponent<Props> = ({filter, setFilter, projects}: Props) => (
  <Fragment>
    <ProjectSearch setFilter={setFilter} filter={filter} />
    <ProjectGrid projects={projects} />
  </Fragment>
)

const mapStateToProps = (state: ApplicationRootState) => selectDiscoverContainer(state);

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    setFilter: (filter) => dispatch(setFilter(filter)),
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


export default compose(
  withReducer,
  withConnect,
)(DiscoverContainer);
