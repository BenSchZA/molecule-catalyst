import { createStructuredSelector } from 'reselect';
import { RootState } from 'containers/App/types';
import { StateProps } from '.';
import { selectAllProjects } from 'domain/projects/selectors';

const selectAdminProjectListing = createStructuredSelector<RootState, StateProps>({
  projects: selectAllProjects
});



export default selectAdminProjectListing;
