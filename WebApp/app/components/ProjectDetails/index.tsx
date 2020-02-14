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
  Paper,
  Divider,
  Grid,
  Avatar,
  Table,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Button,
} from '@material-ui/core';
import {
  Project,
  ProjectSubmissionStatus,
  FundingState,
} from 'domain/projects/types';
import { Face } from '@material-ui/icons';
import { ethers } from 'ethers';
import dayjs, { Dayjs } from 'dayjs';
import ReactMarkdown from "react-markdown";
import apiUrlBuilder from 'api/apiUrlBuilder';
import ProjectPhaseStatus from 'components/ProjectPhaseStatus';
import MarketChartLayout from 'components/MarketChartLayout';
import styles from './styles';
import { bigNumberify } from 'ethers/utils';
import TransactionModalContainer from 'containers/TransactionModalContainer';
import ReactGA from 'react-ga';

interface OwnProps extends WithStyles<typeof styles> {
  project: Project;
  userAddress?: string;
  isLoggedIn: boolean;
}

const ProjectDetails: React.FunctionComponent<OwnProps> = ({
  project,
  classes,
  userAddress,
  isLoggedIn,
}: OwnProps) => {
  const [modalState, setModalState] = useState(false);
  const [modalMode, setModalMode] = useState<'support' | 'redeem'>('support');

  const handleOpenSupportModal = () => {
    setModalMode('support')
    setModalState(true);

    ReactGA.event({
      category: "ProjectDetails",
      action: "User opened the support modal",
    });
  };

  const handleOpenRedeemModal = () => {
    setModalMode('redeem')
    setModalState(true);

    ReactGA.event({
      category: "ProjectDetails",
      action: "User opened the redeem modal",
    });
  };

  const handleClose = () => {
    setModalState(false);
  };

  const userHasBalance = userAddress && project?.marketData?.balances?.[userAddress] &&
    Number(Number(ethers.utils.formatEther(project?.marketData?.balances?.[userAddress])).toFixed(8)) > 0;

  const getEndDateOffset = (phases, phaseIndex) => {
    const firstPhaseDate: Dayjs = dayjs(project.vaultData.phases[0].startDate);

    if (phaseIndex + 1 < phases.length && phases[phaseIndex + 1].state >= FundingState.ONGOING) {
      const periodEnd = dayjs(phases[phaseIndex + 1].startDate).format('YYYY-MM-DD');
      return dayjs(periodEnd).diff(dayjs(firstPhaseDate.format('YYYY-MM-DD')), 'day');
    }
    const months = phases.map((phase, index, array) => phase.phaseDuration)
      .reduce((accumulator, currentValue, index, array) => index <= phaseIndex ? accumulator += currentValue : accumulator, 0);
    return dayjs(firstPhaseDate.add(months, 'month').format('YYYY-MM-DD')).diff(firstPhaseDate.format('YYYY-MM-DD'), 'day');
  };

  const getDateRange = (phaseIndex) => {
    let startDate: Dayjs = dayjs();
    const firstPhaseDate: Dayjs = dayjs(project.vaultData.phases[0].startDate);
    const endDateOffset = getEndDateOffset(project.vaultData.phases, phaseIndex);

    project.vaultData.phases
      .some((phase, index, array) => {
        if (index <= phaseIndex) {
          if (phase.state >= FundingState.ONGOING) {
            startDate = dayjs(phase.startDate);
          } else {
            startDate = firstPhaseDate.add(endDateOffset, 'day').subtract(array[index].phaseDuration, 'month');
          }
          return false;
        } else {
          return true;
        }
      });

    return startDate
      .format('DD MMMM YYYY')
      .toUpperCase() + ' - ' +
      firstPhaseDate
        .add(endDateOffset, 'day')
        .format('DD MMMM YYYY')
        .toUpperCase();
  };

  const getRemainingDuration = (index) => {
    const firstPhaseDate: Dayjs = dayjs(project.vaultData.phases[0].startDate);
    const endDateOffset = getEndDateOffset(project.vaultData.phases, index);

    const currentDate = dayjs();
    const endDate = firstPhaseDate
      .add(endDateOffset, 'day');

    return endDate.diff(currentDate, 'day');
  };

  return project ? (
    <Container maxWidth="lg">
      {userAddress && project.marketData && project.vaultData &&
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
              disabled={!(isLoggedIn && project && project.marketData && project.status !== ProjectSubmissionStatus.ended)} >
              Support Project
            </Button>
            <Button
              className={classes.redeemHoldings}
              onClick={handleOpenRedeemModal}
              disabled={!(isLoggedIn && project && project.marketData && userHasBalance)} >
              Withdraw Stake
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
            <Typography variant="h6" align="right" className={classes.organisationName}>
              {project.user.affiliatedOrganisation &&
                project.user.affiliatedOrganisation.toUpperCase()}
            </Typography>
            {
              project.organisationImage &&
              <Avatar src={apiUrlBuilder.attachmentStream(project.organisationImage)} className={classes.avatarImage} />
            }
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
            <Typography className={classes.fundingLabels}>
              Total Funding Goal
            </Typography>
            <Typography className={classes.fundingAmount}>
              {
                project.vaultData ?
                  Math.ceil(project.vaultData.phases.reduce((total, phase) =>
                    total += Number(ethers.utils.formatEther(phase.fundingThreshold)), 0)).toLocaleString() :
                  project.researchPhases.reduce((total, phase) =>
                    total += phase.fundingGoal, 0)
              } DAI
              </Typography>
          </div>
          <div>
            <Typography className={classes.fundingLabels}>
              Total Pledged
              </Typography>
            <Typography className={classes.fundingAmount}>
              {
                Math.ceil(Number(ethers.utils.formatEther(project?.vaultData?.totalRaised || 0))).toLocaleString()
              } DAI
              </Typography>
          </div>
          <div>
            <Typography className={classes.fundingLabels}>
              Total Released
              </Typography>
            <Typography className={classes.fundingAmount}>
              {
                project.vaultData ?
                  Math.ceil(Number(ethers.utils.formatEther(project.vaultData.phases.filter(value => value.state >= FundingState.ENDED).reduce(
                    (previousValue, currentValue) => previousValue.add(currentValue.fundingThreshold), bigNumberify(0))))).toLocaleString() :
                  0
              } DAI
              </Typography>
          </div>
          <div>
            <Typography className={classes.fundingLabels}>
              Total Duration Left
              </Typography>
            <Typography className={classes.fundingAmount}>
              {
                project.vaultData ? getRemainingDuration(project.vaultData.phases.length - 1) : 0
              } days
              </Typography>
          </div>
        </article>
        <div className={classes.contentWrapper}>
          <Grid className={classes.fundingPhaseSection} container direction='row' alignItems='center' justify='center' spacing={4}>
            {project.vaultData ?
              project.vaultData.phases.map((p, i) =>
                <ProjectPhaseStatus
                  key={i + 1}
                  daysLeft={getRemainingDuration(i)}
                  phase={{
                    index: i + 1,
                    fundedAmount: Number(ethers.utils.formatEther(p.fundingRaised)),
                    fundingGoal: Number(ethers.utils.formatEther(p.fundingThreshold)),
                    title: project.researchPhases[i].title,
                    startDate: p.startDate,
                    state: p.state,
                    duration: p.phaseDuration,
                    activePhase: project.vaultData.activePhase
                  }} />
              ): project.researchPhases.map((p, i) => 
                <ProjectPhaseStatus 
                  key={i + 1}
                  daysLeft={p.duration}
                  phase={{
                    index: i + 1,
                    fundedAmount: 0,
                    fundingGoal: p.fundingGoal,
                    title: p.title,
                    startDate: '2019-01-01',
                    state: 0,
                    duration: p.duration,
                    activePhase: 0
                  }}/>
              )}
          </Grid>
        </div>
      </Paper>
      <Paper className={classes.projectSection} square>
        <Typography className={classes.sectionTitleText} align="center">
          Token Bonding Curve
        </Typography>
        {project && project.marketData ?
          <MarketChartLayout display={true} project={project} /> :
          <div className={classes.marketSpinner}><CircularProgress /></div>
        }
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
                    {project.vaultData && getDateRange(i)}
                  </Typography>
                </div>
              </Paper>
              <div className={classes.contentWrapper}>
                <Typography className={classes.contentTitleText}>
                  Description
                </Typography>
                <ReactMarkdown source={p.description} className={classes.contentText} />
                <Typography className={classes.contentTitleText}>
                  Goals
                </Typography>
                <ReactMarkdown source={p.result} className={classes.contentText} />
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
          <ReactMarkdown source={project.context} className={classes.contentText} />
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
          <ReactMarkdown source={project.approach} className={classes.contentText} />
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
                  <ReactMarkdown source={update.update} className={classes.contentText} />
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
