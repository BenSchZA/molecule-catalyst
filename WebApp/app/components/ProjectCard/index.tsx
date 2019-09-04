/**
 *
 * ProjectCard
 *
 */

import React, { Fragment, useState } from 'react';
import { Theme, createStyles, withStyles, WithStyles, CardContent, Card, CardHeader, CardMedia, Typography, CardActions, Chip, Avatar } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import { lighten } from '@material-ui/core/styles';
import { colors } from 'theme';
import apiUrlBuilder from 'api/apiUrlBuilder';
import { Project } from 'domain/projects/types';
import { forwardTo } from 'utils/history';

const styles = (theme: Theme) =>
  createStyles({
    percentage: {
      color: '#37B4A4',
      fontWeight: 'lighter',
      fontSize: '60px',
      float: 'left',
      paddingTop: '0px',
      marginTop: '12px',
      paddingBottom: '15px',
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
      height: '100px',
      paddingLeft: '16px',
      paddingTop: '23px',
      textOverflow: 'ellipsis',
      whiteSpace: 'inherit',
      overflow: 'hidden',
      color: colors.darkGrey,
      font: '20px/27px Roboto, san-serif'
    },
    projectLeadLabel: {
      font: '10px Montserrat',
      fontWeight: 'bold',
      letterSpacing: '1.88px',
      float: 'left',
      paddingTop: '4px',
      paddingRight: '5px',
    },
    projectLead: {
      fontWeight: 'bolder',
      float: 'left',
      font: '14px Montserrat',
      letterSpacing: '1.88px',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: 'inline-block',
      width: '100%'
    },
    association: {
      fontWeight: 'bolder',
      font: '16px Montserrat',
      letterSpacing: '1.88px',
      float: 'left',
      paddingTop: '5px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: 'inline-block',
      width: '100%'
    },
    footer: {
      float: 'left',
      paddingTop: '8px',
      paddingBottom: '8px',
      width: '60%',
      minWidth: '350px'
    },
    card: {
      cursor: 'pointer',
    },
    cardImage: {
      paddingTop: 36,
      height: 280
    },
    avatar: {
      float: 'right',
      paddingTop: '8px',
      paddingBottom: '8px',
      paddingLeft: '30%'
    }

  });

const BorderLinearProgress = withStyles({
    root: {
      height: 5,
      width: '647px',
      backgroundColor: lighten(colors.moleculeBranding.third, 0.5),
      paddingleft: '0px',
      marginTop: '84px!important',
      marginBottom: '0px!important',
      marginLeft: '0px!important',
      marginRight: '0px!important'
    },
    bar: {
      borderRadius: 20,
      backgroundColor: colors.moleculeBranding.third,
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

const ProjectCard: React.FunctionComponent<OwnProps> = ({ project, classes }: OwnProps) => {
  const [raised, setRaised] = useState(true);

  return (
    <Fragment>
     <Card
      className={classes.card}
      onClick={() => forwardTo(`project/${project.id}`)}
      onMouseOver={() => setRaised(true)} 
      onMouseOut={() => setRaised(false)}
      raised={raised}>
      <CardHeader
        title={project.title}
        subheader={switchStatus(project.status)}
      />
       <CardContent>
         <div className={classes.abstract}>
        {truncateText(project.abstract)}
         </div>
         <Typography className={classes.percentage}>55%</Typography>
         <Chip color="primary" label={'Funded of $' + project.researchPhases.reduce((projectTotal, phase) => projectTotal += phase.fundingGoal, 0).toLocaleString()} />
      <BorderLinearProgress
        className={classes.margin}
        variant="determinate"
        color="secondary"
        value={50}  />
      </CardContent>
      <CardMedia
        className={classes.cardImage}
        component='img'
        src={apiUrlBuilder.attachmentStream(project.featuredImage)}
      />
      <CardActions disableSpacing>
        <div className={classes.footer}>
        <div>
        <div className={classes.projectLead}><div className={classes.projectLeadLabel}>PROJECT LEAD BY</div>{project.user.fullName}</div>
        </div>
        <div className={classes.association}>{project.user.affiliatedOrganisation}</div>
        </div>
        <div className={classes.avatar}>
        <Avatar src='http://www.staff.uct.ac.za/sites/default/files/image_tool/images/431/services/comms_marketing/branding/logo_downloads/transparent_round_logo.gif'></Avatar>
        </div>
      </CardActions>
    </Card>
  </Fragment>);
};

export default withStyles(styles, { withTheme: true })(ProjectCard);
