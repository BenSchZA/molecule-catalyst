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
import { Project, ProjectSubmissionStatus } from 'domain/projects/types';
import { forwardTo } from 'utils/history';
import { ethers } from 'ethers';

const styles = (theme: Theme) =>
  createStyles({
    percentage: {
      color: '#03DAC6',
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
      fontFamily: 'Roboto',
      fontSize: '18px'
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
      maxWidth: 647
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
    },
    cardContent: {
      fontSize: '0.9rem',
      fontWeight: 'normal',
      color: colors.darkGrey,
      paddingTop: '12px',
      height: '184px',
      paddingLeft: '0px',
      fontFamily: 'Roboto'
    },
    avatarImage: {
      width: 50,
      height: 50,
    },
  });

const BorderLinearProgress = withStyles({
  root: {
    height: 3,
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


const truncateText = (text: string) => {
  if (text.length < 175)
    return text;
  return text.substr(0, 175) + '...';
}

interface OwnProps extends WithStyles<typeof styles> {
  project: Project
}

const switchStatus = (status) => {
  switch (status) {
    case ProjectSubmissionStatus.ended:
      return 'ENDED';
    default:
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
          subheader={switchStatus(project.status)} />
        <CardContent className={classes.cardContent}>
          <div className={classes.abstract}>{truncateText(project.abstract)}</div>
          <Typography className={classes.percentage}>
            {
              (() => {
                const totalRaised = Number(ethers.utils.formatEther(project.vaultData.totalRaised));
                const totalFundingGoal = project.vaultData.phases.reduce((total, phase) =>
                  total += Number(ethers.utils.formatEther(phase.fundingThreshold)), 0);
                return totalRaised >= totalFundingGoal ? 100 : Math.ceil(totalRaised / totalFundingGoal * 100);
              })()
            } %
        </Typography>
          <Chip color="primary" label={
            'Funded of ' + Math.ceil(project.vaultData.phases.reduce((total, phase) =>
              total += Number(ethers.utils.formatEther(phase.fundingThreshold)), 0)).toLocaleString() + ' DAI'
          } />
          <BorderLinearProgress
            className={classes.margin}
            variant="determinate"
            color="secondary"
            value={
              (() => {
                const totalRaised = Number(ethers.utils.formatEther(project.vaultData.totalRaised));
                const totalFundingGoal = project.vaultData.phases.reduce((total, phase) =>
                  total += Number(ethers.utils.formatEther(phase.fundingThreshold)), 0);
                return totalRaised >= totalFundingGoal ? 100 : Math.ceil(totalRaised / totalFundingGoal * 100);
              })()
            }
          />
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
            {
              project.organisationImage && project.organisationImage ? <Avatar src={apiUrlBuilder.attachmentStream(project.organisationImage)} className={classes.avatarImage}></Avatar> : null
            }
          </div>
        </CardActions>
      </Card>
    </Fragment>);
};

export default withStyles(styles, { withTheme: true })(ProjectCard);
