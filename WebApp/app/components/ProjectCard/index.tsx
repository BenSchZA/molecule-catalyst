/**
 *
 * ProjectCard
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, CardContent, Card, CardHeader, CardMedia, Typography, CardActions, Chip } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import { lighten } from '@material-ui/core/styles';
import { colors } from 'theme';
import apiUrlBuilder from 'api/apiUrlBuilder';
import { Project } from 'domain/projects/types';

const styles = (theme: Theme) =>
  createStyles({
    percentage: {
      color: colors.moleculeBranding.primary,
      fontWeight: 'lighter',
      fontSize: '60px',
      float: 'left',
      paddingTop: '0px',
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
      color: colors.darkGrey,
      font: '20px/27px Roboto, san-serif'
    },
    projectLeadLabel: {
      fontSize: '0.5rem',
      fontWeight: 'bold',
      fontFamily: 'Montserrat',
      float: 'left'
    },
    projectLead: {
      fontSize: '0.6em',
      fontWeight: 'bold',
      fontFamily: 'Montserrat',
      float: 'left',
      paddingLeft: '5px'
    },
    association: {
      fontSize: '1rem',
      fontWeight: 'bold',
      fontFamily: 'Montserrat',
      float: 'left',
      paddingTop: '5px'
    },
    footer: {
      float: 'left',
      paddingTop: '8px',
      paddingBottom: '8px',
    }

  });

const BorderLinearProgress = withStyles({
    root: {
      height: 5,
      width: '647px',
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

const switchStatus = (status) => {
  switch(status){
      default :
        return 'ONGOING';
  }
};

const ProjectCard: React.FunctionComponent<OwnProps> = ({ project, classes }: OwnProps) => (
  <Fragment>
     <Card elevation={8}>
      <CardHeader
        title={project.title}
        subheader={switchStatus(project.status)}
      />
       <CardContent>
         <div className={classes.abstract}>
        {truncateText(project.abstract)}
         </div>
         <Typography className={classes.percentage}>55%</Typography>
         <Chip color="primary" label="Funded of $10,000" />
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
        <div className={classes.footer}>
        <div>
       <div className={classes.projectLeadLabel}>PROJECT LEAD BY</div>
       <div className={classes.projectLead}>JOHN H. MYRLAND SNR PH.D</div>
       </div>
       <div className={classes.association}>Stanford University</div>
       </div>
      </CardActions>
    </Card>
  </Fragment>
);

export default withStyles(styles, { withTheme: true })(ProjectCard);
