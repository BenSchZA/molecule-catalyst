/**
 *
 * ProjectCard
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, CardContent, Card, CardHeader, CardMedia, Typography, CardActions } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import { lighten } from '@material-ui/core/styles';
import { colors } from 'theme';
import apiUrlBuilder from 'api/apiUrlBuilder';
import { Project, ProjectSubmissionStatus } from 'domain/projects/types';

const styles = (theme: Theme) =>
  createStyles({
    avatar: {
      backgroundColor: 'red',
    },
    percentage: {
      color: colors.moleculeBranding.primary,
      float: 'left',
      paddingTop: '12px',
      marginTop: '12px',
      paddingBottom: '0px',
      paddingLeft: '16px'
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    margin: {
      margin: theme.spacing(1),
    },
    abstract: {
      height: '64px',
      paddingLeft: '16px',
      paddingTop: '8px',
      textOverflow: 'ellipsis',
      whiteSpace: 'inherit',
      overflow: 'hidden',
    },

  });

const BorderLinearProgress = withStyles({
    root: {
      height: 5,
      width: '450px',
      backgroundColor: lighten(colors.moleculeBranding.primary, 0.5),
      paddingleft: '0px',
      marginTop: '84px!important',
      marginBottom: '0px!important',
      marginLeft: '0px!important',
      marginRight: '0px!important'
    },
    bar: {
      borderRadius: 20,
      backgroundColor: colors.moleculeBranding.primary,
    },
  })(LinearProgress);


const truncateText = (text : string) => {
  if(text.length < 175)
    return text;
  return text.substr(0, 175) + '...';
}

interface OwnProps extends WithStyles<typeof styles> {
  project: Project
}

const ProjectCard: React.FunctionComponent<OwnProps> = ({ project, classes }: OwnProps) => (
  <Fragment>
     <Card>
      <CardHeader
        title={project.title}
        subheader={ProjectSubmissionStatus[project.status].toUpperCase()}
      />
       <CardContent>
         <div className={classes.abstract}>
        {truncateText(project.abstract)}
         </div>
         <Typography variant="h3" className={classes.percentage}>55%</Typography>
          
      <BorderLinearProgress
        className={classes.margin}
        variant="determinate"
        color="secondary"
        value={50}  />
      </CardContent>
      <CardMedia
        component='img'
        src={apiUrlBuilder.attachmentStream(project.featuredImage)}
      />
      <CardActions disableSpacing>
       
      </CardActions>
    </Card>
  </Fragment>
);

export default withStyles(styles, { withTheme: true })(ProjectCard);
