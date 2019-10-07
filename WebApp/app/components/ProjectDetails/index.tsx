/**
 *
 * ProjectDetails
 *
 */

import React, { useState } from 'react';
import {
  withStyles,
  WithStyles,
  Container,
  Typography,
  Button,
  Paper,
  Divider,
  Grid,
  Avatar,
  Table,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
} from '@material-ui/core';
import {
  Project,
  ProjectSubmissionStatus,
  FundingState,
} from 'domain/projects/types';
import apiUrlBuilder from 'api/apiUrlBuilder';
import { Face } from '@material-ui/icons';
import ProjectPhaseStatus from 'components/ProjectPhaseStatus';
import MarketChartLayout from 'components/MarketChartLayout';
import dayjs from 'dayjs';
import { ethers } from 'ethers';
import styles from './styles';
import { bigNumberify } from 'ethers/utils';
import TransactionModalContainer from 'containers/TransactionModalContainer';

interface OwnProps extends WithStyles<typeof styles> {
  project: Project;
  userAddress?: string;
}

const ProjectDetails: React.FunctionComponent<OwnProps> = ({
  project,
  classes,
  userAddress,
}: OwnProps) => {
  const [modalState, setModalState] = useState(false);
  const [modalMode, setModalMode] = useState<'support'|'redeem'>('support');

  const handleOpenSupportModal = () => {
    setModalMode('support')
    setModalState(true);
  };

  const handleOpenRedeemModal = () => {
    setModalMode('redeem')
    setModalState(true);
  };

  const handleClose = () => {
    setModalState(false);
  };

  return project ? (
    <Container maxWidth="lg">
      {project.chainData && project.chainData.marketData && userAddress &&
        <TransactionModalContainer 
          projectId={project.id}
          userAddress={userAddress}
          modalState={modalState}
          mode={modalMode}
          handleClose={handleClose} />
      }
      <div className={classes.bannerWrapper}>
        <img
          src={apiUrlBuilder.attachmentStream(project.featuredImage)}
          className={classes.bannerImage}
        />
        <div className={classes.bannerContent}>
          <Typography className={classes.projectTitle}>
            {project.title}
          </Typography>
          <div>
            <Button
              className={classes.supportProject}
              onClick={handleOpenSupportModal}
              disabled={!(project && project.chainData && project.chainData.marketData && project.status !== ProjectSubmissionStatus.ended)}
            >
              Support Project
            </Button>
            <Button
              className={classes.redeemHoldings}
              onClick={handleOpenRedeemModal}
              disabled={!(project && project.chainData && project.chainData.marketData && project.status !== ProjectSubmissionStatus.ended)}
            >
              Redeem Holdings
            </Button>
          </div>
        </div>
        <div className={classes.bannerFooter}>
          <div>
            <div className={classes.researcherAvatar}>
              <Avatar
                src={
                  project.user.profileImage &&
                  apiUrlBuilder.attachmentStream(project.user.profileImage)
                }
              >
                {!project.user.profileImage && <Face fontSize="large" />}
              </Avatar>
            </div>
            <Typography variant="h6">
              {project.user.fullName &&
                project.user.fullName.toUpperCase() +
                ', ' +
                project.user.professionalTitle.toUpperCase()}
            </Typography>
          </div>
          <div>
            <Typography variant="h6" align="right">
              {project.user.affiliatedOrganisation &&
                project.user.affiliatedOrganisation.toUpperCase()}
            </Typography>
          </div>
        </div>
      </div>
      <Paper className={classes.projectSection} square>
        <Grid container>
          <Grid item xs={6}>
            <Typography className={classes.startDate}>
              START DATE:{' '}
              {dayjs(project.createdAt)
                .format('DD MMMM YYYY')
                .toUpperCase()}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.startDate} align="right">
              STATUS: {ProjectSubmissionStatus[project.status].toUpperCase()}
            </Typography>
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
        <Typography variant="h4" align="center">
          Overview
        </Typography>
        <div className={classes.contentWrapper}>
          <Typography className={classes.abstract}>Abstract</Typography>
          <Typography className={classes.lastUpdated}>
            {dayjs(project.createdAt)
              .format('DD MMM YYYY h:mm ')
              .toUpperCase()}
          </Typography>
          <Typography paragraph className={classes.abstractText}>
            {project.abstract}
          </Typography>
          <Typography className={classes.lastUpdated} align="right">
            LAST UPDATED BY:{' '}
            {project.user.fullName &&
              project.user.fullName.toUpperCase() +
              ', ' +
              project.user.professionalTitle.toUpperCase()}
          </Typography>
        </div>
        <Typography className={classes.sectionTitleText} align="center">Funding Status</Typography>
        <article className={classes.fundingStatusSection} >
          <div>
            <Typography className={classes.projectProgress}>
              {
                (() => {
                  const totalRaised = Number(ethers.utils.formatEther(project.vaultData.totalRaised));
                  const totalFundingGoal = project.vaultData.phases.reduce((total, phase) =>
                    total += Number(ethers.utils.formatEther(phase.fundingThreshold)), 0);
                  return totalRaised >= totalFundingGoal ? 100 : Math.ceil(totalRaised / totalFundingGoal * 100);
                })()
              } %
              </Typography>
          </div>
          <div>
            <Typography className={classes.fundingLabels}>
              Total Funding Goal
              </Typography>
            <Typography className={classes.fundingAmount}>
              {
                Math.ceil(project.vaultData.phases.reduce((total, phase) =>
                  total += Number(ethers.utils.formatEther(phase.fundingThreshold)), 0)).toLocaleString()
              } DAI
              </Typography>
          </div>
          <div>
            <Typography className={classes.fundingLabels}>
              Total Pledged
              </Typography>
            <Typography className={classes.fundingAmount}>
              {
                Math.ceil(Number(ethers.utils.formatEther(project.vaultData.totalRaised))).toLocaleString()
              } DAI
              </Typography>
          </div>
          <div>
            <Typography className={classes.fundingLabels}>
              Total Released
              </Typography>
            <Typography className={classes.fundingAmount}>
              {
                Math.ceil(Number(ethers.utils.formatEther(project.vaultData.phases.filter(value => value.state >= FundingState.ENDED).reduce(
                  (previousValue, currentValue) => previousValue.add(currentValue.fundingThreshold), bigNumberify(0))))).toLocaleString()
              } DAI
              </Typography>
          </div>
          <div>
            <Typography className={classes.fundingLabels}>
              Total Duration Left
              </Typography>
            <Typography className={classes.fundingAmount}>
              {
                dayjs(dayjs(project.createdAt).add(project.researchPhases.reduce((totalMonths, phase) => totalMonths += phase.duration, 0), 'month')).diff(project.createdAt, 'day')
              } days
              </Typography>
          </div>
        </article>
        <div className={classes.contentWrapper}>
          <Grid className={classes.fundingPhaseSection} container direction='row' alignItems='center' justify='center' spacing={4}>
            {project.vaultData.phases && project.vaultData.phases.map((p, i) =>
              <ProjectPhaseStatus key={i + 1} phase={{
                index: i + 1,
                fundedAmount: Number(ethers.utils.formatEther(p.fundingRaised)),
                fundingGoal: Number(ethers.utils.formatEther(p.fundingThreshold)),
                title: project.researchPhases[i].title,
                startDate: p.startDate,
                state: p.state,
                duration: p.phaseDuration,
                activePhase: project.vaultData.activePhase
              }} />
            )}
          </Grid>
        </div>

        <div className={classes.contentWrapper}>
          <Typography className={classes.sectionTitleText} align="center">
            Market
          </Typography>
          {project && project.chainData && project.chainData.marketData &&
            <MarketChartLayout display={true} project={project} />
          }
        </div>
      </Paper>
      <Paper className={classes.projectSection} square>
        <Typography className={classes.sectionTitleText} align="center">
          Team
        </Typography>
        <Paper className={classes.fullWidthSection} elevation={0} square>
          <Typography className={classes.projectLeadTitleText} align="center">
            {project.user.fullName}, {project.user.professionalTitle} at{' '}
            {project.user.affiliatedOrganisation}
          </Typography>
          <div className={classes.avatar}>
            <Avatar
              src={
                project.user.profileImage &&
                apiUrlBuilder.attachmentStream(project.user.profileImage)
              }
            >
              {!project.user.profileImage && <Face fontSize="large" />}
            </Avatar>
          </div>
          <Typography className={classes.projectLeadText} align="center">
            Project Lead
          </Typography>
        </Paper>
        <div className={classes.contentWrapper}>
          <Typography className={classes.contentTitleText}>
            Biography
          </Typography>
          <Typography className={classes.contentText}>
            {project.user.biography}
          </Typography>
          <Typography className={classes.contentTitleText}>
            Collaborators
          </Typography>
          <Table>
            <TableBody>
              {project.collaborators &&
                project.collaborators.map((c, i) => (
                  <TableRow key={i}>
                    <TableCell>{c.fullName}</TableCell>
                    <TableCell>{c.professionalTitle}</TableCell>
                    <TableCell>{c.affiliatedOrganisation}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </Paper>
      <Paper className={classes.projectSection} square>
        <Typography className={classes.sectionTitleText} align="center">
          Funding Campaign
        </Typography>
        {project.researchPhases &&
          project.researchPhases.map((p, i) => (
            <div key={i}>
              <Paper className={classes.phasePaperTitle} elevation={0} square>
                <Typography className={classes.phaseTitleText} align="center">
                  Phase 0{i + 1}: {p.title}
                </Typography>
                <div className={classes.phaseDateChip}>
                  <Typography className={classes.phaseDates} align="center">
                    {dayjs(project.vaultData.phases[i].startDate)
                      .format('DD MMMM YYYY')
                      .toUpperCase() +
                      ' - ' +
                      dayjs(project.vaultData.phases[i].startDate)
                        .add(p.duration, 'month')
                        .format('DD MMMM YYYY')
                        .toUpperCase()}
                  </Typography>
                </div>
              </Paper>
              <div className={classes.contentWrapper}>
                <Typography className={classes.contentTitleText}>
                  Description
                </Typography>
                <Typography className={classes.contentText}>
                  {p.description}
                </Typography>
                <Typography className={classes.contentTitleText}>
                  Goals
                </Typography>
                <Typography className={classes.contentText}>
                  {p.result}
                </Typography>
              </div>
            </div>
          ))}
      </Paper>

      <Paper className={classes.projectSection} square>
        <div className={classes.contentWrapper}>
          <Typography className={classes.sectionTitleText} align="center">
            Research Background
          </Typography>
          <Typography className={classes.contentTitleText}>
            Context and Significance
          </Typography>
          <Typography className={classes.lastUpdated}>
            {dayjs(project.createdAt)
              .format('DD MMM YYYY h:mm ')
              .toUpperCase()}
          </Typography>
          <Typography className={classes.contentText}>
            {project.context}
          </Typography>
          <Typography className={classes.lastUpdated} align="right">
            LAST UPDATED BY:{' '}
            {project.user.fullName &&
              project.user.fullName.toUpperCase() +
              ', ' +
              project.user.professionalTitle.toUpperCase()}
          </Typography>
          <Typography className={classes.contentTitleText}>Approach</Typography>
          <Typography className={classes.lastUpdated}>
            {dayjs(project.createdAt)
              .format('DD MMM YYYY h:mm ')
              .toUpperCase()}
          </Typography>
          <Typography className={classes.contentText}>
            {project.approach}
          </Typography>
          <Typography className={classes.lastUpdated} align="right">
            LAST UPDATED BY:{' '}
            {project.user.fullName &&
              project.user.fullName.toUpperCase() +
              ', ' +
              project.user.professionalTitle.toUpperCase()}
          </Typography>
        </div>
      </Paper>
      <Paper className={classes.projectSection} square>
        <div className={classes.contentWrapper}>
          <Typography className={classes.sectionTitleText} align="center">
            Research Updates
          </Typography>
          {project.researchUpdates && project.researchUpdates.length > 0 ?
            project.researchUpdates.sort((a, b) => a.date < b.date ? 1 :
              a.date === b.date ? 0 : -1).map((update, index) =>
                <div key={index}>
                  <Typography className={classes.lastUpdated}>
                    {dayjs(update.date)
                      .format('DD MMM YYYY h:mm ')
                      .toUpperCase()}
                  </Typography>
                  <Typography className={classes.contentText}>
                    {update.update}
                  </Typography>
                </div>
              )
            :
            <Typography variant='body1' className={classes.researchUpdatesSubHeading}>
              There are currently no research updates.
                </Typography>
          }
        </div>
      </Paper>
    </Container>
  ) : (
      <Container>
        <CircularProgress className={classes.loadingSpinner} />
      </Container>
    );
};

export default withStyles(styles, { withTheme: true })(ProjectDetails);
