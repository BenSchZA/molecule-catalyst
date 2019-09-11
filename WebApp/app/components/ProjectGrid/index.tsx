import React from 'react';
import { compose } from 'redux';
import { Theme, WithStyles, Container, Divider } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import { Project } from 'domain/projects/types';
import ProjectCard from 'components/ProjectCard';
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
    flexDirection: "row",
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

const ProjectGrid: React.FunctionComponent<OwnProps> = ({projects, classes}: OwnProps) => (
  <Container className={classes.maxWidthLg}>
     <Divider className={classes.divider} variant='middle' />
    <div className={classes.grid}>
      {projects && projects.length > 0 && projects.map((p, index) =>
      <div>
        <ProjectCard key={index} project={p}/>
        <BackedProjectCard key={index} project={p}/>
        </div>
      )}
    </div>
  </Container>
);

export default compose(
  withStyles(styles, { withTheme: true }),
)(ProjectGrid);
