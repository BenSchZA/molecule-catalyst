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
      fontSize: '18px',
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
      fontSize: '18px',
      fontFamily: 'Roboto'
    },
    explainerText: {
      textAlign: 'center',
      fontSize: '20px',
      fontFamily: 'Roboto',
      fontWeight: 'normal',
      letterSpacing: '0.09px',
      color: '#00000099',
      opacity: 1.0,
      paddingBottom: '20px'
    },
    explainerSubText: {
      textAlign: 'center',
      fontSize: '14px',
      fontFamily: 'Roboto',
      fontWeight: 'normal',
      letterSpacing: '0.09px',
      color: '#00000099',
      opacity: 1.0,
      paddingBottom: '45px'
    },
    textBoxInput: {
      fontSize: '18px',
      fontFamily: 'Roboto',
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
    value: ProjectSubmissionStatus.ongoing,
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
    <div>
      <Typography className={classes.explainerText}>
        Explore researchers and organisations who are using Molecule Catalyst to realise their goals for new and innovative research initiatives and experimental studies.
      </Typography>
    </div>
    <div>
      <Typography className={classes.explainerSubText}>
        All featured projects undergo a scientific peer-review process before being listed on our platform.
      </Typography>
    </div>
    <TextField 
      name='text'
      value={filter.text}
      placeholder='Search'
      onChange={updateFilter}
      InputProps={{
        endAdornment: <Search />,
        disableUnderline: true,
        className: classes.textBoxInput,
      }}
      inputProps={{
        className: classes.textBoxInput,
      }}
      className={classes.textInput}/>
    <TextField 
      name='projectStatus'
      select
      value={filter.projectStatus}
      onChange={updateFilter} 
      className={classes.projectStatus}
      InputProps={{
        disableUnderline: true,
      }} 
      inputProps={{
        className: classes.textBoxInput,
      }}>
      {filterStatuses.map(option => (
        <MenuItem className={classes.menuItem} key={option.value} value={option.value}>{option.label}</MenuItem>
      ))}
    </TextField>
   
  </Container>
)};

export default withStyles(styles, { withTheme: true })(ProjectSearch);
