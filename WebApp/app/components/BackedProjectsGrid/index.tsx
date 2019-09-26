import React from 'react';
import { compose } from 'redux';
import { Theme, WithStyles, Container, Divider, Typography } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import { Project } from 'domain/projects/types';
import BackedProjectCard from 'components/BackedProjectCard';
//import { forwardTo } from 'utils/history';

const marginForGrid = 20;

const styles = (theme: Theme) => createStyles({
  maxWidthLg: {
    maxWidth: '1920px',
    margin: "0 auto"
  },
  divider: {
    margin: "40px auto 10px"
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`,
    maxWidth: '1980px',
    alignItems: 'center',
    "& > *":{
      margin: `0 ${marginForGrid}px ${marginForGrid * 2}px ${marginForGrid}px`
    }
  }
});

interface OwnProps extends WithStyles<typeof styles> {
  classes: any;
  projects: Array<Project>;
}

const BackedProjectsGrid: React.FunctionComponent<OwnProps> = ({projects, classes}: OwnProps) => (
  <Container className={classes.maxWidthLg}>
    <Typography variant='h2' className={classes.header}>My Projects</Typography>
     <Divider className={classes.divider} variant='middle' />
    <div className={classes.grid}>
      {projects && projects.length > 0 && projects.map((p, index) =>

        <BackedProjectCard key={index} project={p}/>
      )}
    </div>
  </Container>
);

export default compose(
  withStyles(styles, { withTheme: true }),
)(BackedProjectsGrid);
