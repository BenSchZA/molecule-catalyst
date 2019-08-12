/**
 *
 * ProjectSearch
 *
 */

import React from 'react';
import { Theme, createStyles, withStyles, WithStyles, Container, TextField, MenuItem, Typography, Divider } from '@material-ui/core';
import { ProjectSubmissionStatus } from 'domain/projects/types';
import { Search } from '@material-ui/icons';

const styles = (theme: Theme) =>
  createStyles({
    // JSS in CSS goes here
  });

interface OwnProps extends WithStyles<typeof styles> {
  setFilter: (filter) => void
  filter: {
    text: string,
    projectStatus?: number | undefined,
  }
}

const ProjectSearch: React.FunctionComponent<OwnProps> = ({filter}: OwnProps) => {
  const filterStatuses = [{
    label: 'All Statuses',
    value: -1
  }, {
    label: ProjectSubmissionStatus[ProjectSubmissionStatus.started],
    value: 'Ongoing',
  }, {
    label: ProjectSubmissionStatus[ProjectSubmissionStatus.ended],
    value: 'Ended',
  }]
  
  return (
  <Container maxWidth='md'>
    <Typography variant='h1'>Discover</Typography>
    <TextField 
      name='text'
      InputProps={{
        endAdornment: <Search />
      }}/>
    <TextField 
      select
      value={filter.projectStatus}
      onChange={(e) => console.log(e.target.value)} >
      {filterStatuses.map(option => (
        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
      ))}
    </TextField>
    <Divider variant='middle' />
  </Container>
)};

export default withStyles(styles, { withTheme: true })(ProjectSearch);
