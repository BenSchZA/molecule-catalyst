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
    searchBarContainer: {
      textAlign: 'center',
    },
    textInput: {
      width: 400
    },
    projectStatus: {
      width: 200
    }
  });

interface OwnProps extends WithStyles<typeof styles> {
  setFilter: (filter) => void
  filter: {
    text: string,
    projectStatus?: number | undefined,
  }
}

const ProjectSearch: React.FunctionComponent<OwnProps> = ({filter, setFilter, classes}: OwnProps) => {
  const filterStatuses = [{
    label: 'All Statuses',
    value: -1
  }, {
    label: 'Ongoing',
    value: ProjectSubmissionStatus.started,
  }, {
    label: 'Ended',
    value: ProjectSubmissionStatus.ended,
  }]
  
  function updateFilter(e) {
    setFilter({[e.target.name]: e.target.value})
  }

  return (
  <Container maxWidth='md' className={classes.searchBarContainer}>
    <Typography variant='h1'>Discover</Typography>
    <TextField 
      name='text'
      value={filter.text}
      onChange={updateFilter}
      InputProps={{
        endAdornment: <Search />
      }}
      className={classes.textInput}/>
    <TextField 
      name='projectStatus'
      select
      value={filter.projectStatus}
      onChange={updateFilter} 
      className={classes.projectStatus}>
      {filterStatuses.map(option => (
        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
      ))}
    </TextField>
    <Divider variant='middle' />
  </Container>
)};

export default withStyles(styles, { withTheme: true })(ProjectSearch);
