/**
 *
 * ProjectSearch
 *
 */

import React from 'react';
import { Theme, createStyles, withStyles, WithStyles, Container, TextField, MenuItem, Typography } from '@material-ui/core';
import { ProjectSubmissionStatus } from 'domain/projects/types';
import { Search } from '@material-ui/icons';
import { colors } from 'theme';

const styles = (theme: Theme) =>
  createStyles({
    searchBarContainer: {
      textAlign: 'center',
    },
    textInput: {
      width: 655,
      height: 56,
      borderRadius: 3,
      border: 'unset',
      paddingTop: 16,
      paddingBottom: 16,
      paddingLeft: 16,
      paddingRight: 16,
      margin: 0,
    },
    projectStatus: {
      width: 210,
      height: 56,
      marginTop: 0,
      
      verticalAlign: 'center',
      textAlign: 'center',
      paddingTop: 15
    },
    header: {
      paddingTop: 140,
      fontWeight: 'normal'
    },
    menuItem: {
      color: colors.darkGrey,
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
    <Typography variant='h2' className={classes.header}>Discover</Typography>
    <TextField 
      name='text'
      value={filter.text}
      placeholder='Search'
      onChange={updateFilter}
      InputProps={{
        endAdornment: <Search />,
        disableUnderline: true
      }}
      className={classes.textInput}/>
    <TextField 
      name='projectStatus'
      select
      value={filter.projectStatus}
      onChange={updateFilter} 
      className={classes.projectStatus}
      InputProps={{
        disableUnderline: true
      }}>
      {filterStatuses.map(option => (
        <MenuItem className={classes.menuItem} key={option.value} value={option.value}>{option.label}</MenuItem>
      ))}
    </TextField>
   
  </Container>
)};

export default withStyles(styles, { withTheme: true })(ProjectSearch);
