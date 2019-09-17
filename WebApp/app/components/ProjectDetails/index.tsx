/**
 *
 * ProjectDetails
 *
 */

import React from 'react';
import { withStyles, WithStyles, Container, Typography, Button, Paper, Divider, Grid, Avatar, Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import { Project, ProjectSubmissionStatus, FundingState } from 'domain/projects/types';
import apiUrlBuilder from 'api/apiUrlBuilder';
import { Face } from '@material-ui/icons';
import ProjectPhaseStatus from 'components/ProjectPhaseStatus';
import ProjectSupportModal from 'components/ProjectSupportModal';
import { FormikProps, FormikValues } from 'formik';
import ProjectRedeemModal from 'components/ProjectRedeemModal';
import MarketChartLayout from 'components/MarketChartLayout';
import dayjs from 'dayjs';
import { ethers } from 'ethers';
import styles from './styles';
import { bigNumberify } from 'ethers/utils';

interface OwnProps extends WithStyles<typeof styles> {
  project: Project,
  daiBalance: number,
  userAddress: string,
  formikProps: FormikProps<FormikValues>,
  selectModal(modal: number): void,
}

const ProjectDetails: React.FunctionComponent<OwnProps> = ({ 
    project, 
    daiBalance,
    userAddress,
    classes,
    formikProps,
    selectModal,
  }: OwnProps) => {

  const [open, setOpenModal] = React.useState(false);
  const [openRedeem, setOpenRedeemModal] = React.useState(false);

  const handleOpen = () => {
    selectModal(0);
    setOpenModal(true);
  };

  const handleOpenRedeemModal = () => {
    selectModal(1);
    setOpenRedeemModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setOpenRedeemModal(false);
  };

  const formatEtherPossiblyNegative = (possiblyNegativeHex: string): string => {
    return possiblyNegativeHex.includes('-') ? ethers.utils.formatEther(possiblyNegativeHex.replace('-', '')) 
      : ethers.utils.formatEther(possiblyNegativeHex)
  }

  const holdingsValue = project.chainData.marketData ? 
    Number(ethers.utils.formatEther(project.chainData.marketData.holdingsValue)) : 0;
  const contributionValue = project.marketData.netContributions && project.marketData.netContributions[userAddress] ?
    Number(formatEtherPossiblyNegative(project.marketData.netContributions[userAddress]._hex)) : 0;

  return (
    (project && project.chainData && project.chainData.marketData) ?
      <Container maxWidth='lg'>
        <ProjectSupportModal
          closeModal={handleClose}
          modalState={open}
          formikProps={formikProps}
          daiBalance={daiBalance}
          contributionRate={project.chainData.marketData.taxationRate}
        />
        <ProjectRedeemModal
          closeModal={handleClose}
          modalState={openRedeem}
          formikProps={formikProps}
          holdingsValue={holdingsValue}
          contributionValue={contributionValue}
        />
        <div className={classes.bannerWrapper}>
          <img src={apiUrlBuilder.attachmentStream(project.featuredImage)} className={classes.bannerImage} />
          <div className={classes.bannerContent}>
            <Typography className={classes.projectTitle}>{project.title}</Typography>
            <div>
              <Button className={classes.supportProject} onClick={handleOpen}>Support Project</Button>
              <Button className={classes.redeemHoldings} onClick={handleOpenRedeemModal}>Redeem Holdings</Button>
            </div>
          </div>
          <div className={classes.bannerFooter}>
            <div>
              <div className={classes.researcherAvatar} >
                <Avatar src={project.user.profileImage && apiUrlBuilder.attachmentStream(project.user.profileImage)}>
                  {!project.user.profileImage && <Face fontSize='large' />}
                </Avatar>
              </div>
              <Typography variant='h6'>{project.user.fullName && project.user.fullName.toUpperCase() + ', ' + project.user.professionalTitle.toUpperCase()}</Typography>
            </div>
            <div>
              <Typography variant='h6' align='right'>{project.user.affiliatedOrganisation && project.user.affiliatedOrganisation.toUpperCase()}</Typography>
            </div>
          </div>
        </div>
        <Paper className={classes.projectSection} square>
          <Grid container>
            <Grid item xs={6}>
              <Typography className={classes.startDate}>START DATE: {dayjs(project.createdAt).format('DD MMMM YYYY').toUpperCase()}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.startDate} align='right'>STATUS: {ProjectSubmissionStatus[project.status].toUpperCase()}</Typography>
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Typography variant="h4" align='center'>Overview</Typography>
          <div className={classes.contentWrapper}>
            <Typography className={classes.abstract}>Abstract</Typography>
            <Typography className={classes.lastUpdated}>{dayjs(project.createdAt).format('DD MMM YYYY h:mm ').toUpperCase()}</Typography>
            <Typography paragraph className={classes.abstractText}>{project.abstract}</Typography>
            <Typography className={classes.lastUpdated} align="right">LAST UPDATED BY: {project.user.fullName && project.user.fullName.toUpperCase() + ', ' + project.user.professionalTitle.toUpperCase()}</Typography>
          </div>
          <Typography className={classes.sectionTitleText} align="center">Funding Status</Typography>
          <article className={classes.fundingStatusSection} >
            <div>
              <Typography className={classes.projectProgress}>
              {~~(Number.parseInt(ethers.utils.formatEther(project.vaultData.totalRaised)) / project.researchPhases.reduce((projectTotal, phase) => projectTotal += phase.fundingGoal, 0) * 100)} %
              </Typography>
            </div>
            <div>
              <Typography className={classes.fundingLabels}> 
                Total Funding Goal
              </Typography>
              <Typography className={classes.fundingAmount}>
                {project.researchPhases.reduce((projectTotal, phase) => projectTotal += phase.fundingGoal, 0).toLocaleString()} DAI
              </Typography>
            </div>
            <div>
              <Typography className={classes.fundingLabels}>
                Total Pledged
              </Typography>
              <Typography className={classes.fundingAmount}>
                {(~~ethers.utils.formatEther(project.vaultData.totalRaised)).toLocaleString()} DAI
              </Typography>
            </div>
            <div>
              <Typography className={classes.fundingLabels}>
                Total Released
              </Typography>
              <Typography className={classes.fundingAmount}>
                {ethers.utils.formatEther(project.vaultData.phases.filter(value => value.state >= FundingState.ENDED).reduce(
                  (previousValue, currentValue) => previousValue.add(currentValue.fundingThreshold), bigNumberify(0))).toLocaleString()
                } DAI
              </Typography>
            </div>
            <div>
              <Typography className={classes.fundingLabels}>
                Total Duration Left
              </Typography>
              <Typography className={classes.fundingAmount}>
               {dayjs(dayjs(project.createdAt).add(project.researchPhases.reduce((totalMonths, phase) => totalMonths += phase.duration, 0), 'month')).diff(project.createdAt, 'day')} days
              </Typography>
            </div>
          </article>
          <div className={classes.contentWrapper}>
            <Grid className={classes.fundingPhaseSection} container direction='row' alignItems='center' justify='center' spacing={4}>
              {project.vaultData.phases && project.vaultData.phases.map((p, i) =>
                <ProjectPhaseStatus key={i+1} phase={{
                  index: i+1,
                  fundedAmount: ~~ethers.utils.formatEther(p.fundingRaised),
                  fundingGoal: project.researchPhases[i].fundingGoal,
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
            <Typography className={classes.sectionTitleText} align="center">Market</Typography>
            <MarketChartLayout
              display={true}
              project={project}
            />
          </div>
        </Paper>
        <Paper className={classes.projectSection} square>
          <Typography className={classes.sectionTitleText} align="center">Team</Typography>
          <Paper className={classes.fullWidthSection} elevation={0} square>
            <Typography className={classes.projectLeadTitleText} align="center">
              {project.user.fullName}, {project.user.professionalTitle} at {project.user.affiliatedOrganisation}
            </Typography>
            <div className={classes.avatar} >
              <Avatar src={project.user.profileImage && apiUrlBuilder.attachmentStream(project.user.profileImage)}>
                {!project.user.profileImage && <Face fontSize='large' />}
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
                {project.collaborators && project.collaborators.map((c, i) =>
                  <TableRow key={i}>
                    <TableCell>{c.fullName}</TableCell>
                    <TableCell>{c.professionalTitle}</TableCell>
                    <TableCell>{c.affiliatedOrganisation}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Paper>
        <Paper className={classes.projectSection} square>
          <Typography className={classes.sectionTitleText} align="center">Funding Campaign</Typography>
          {project.researchPhases && project.researchPhases.map((p, i) =>
            <div key={i}>
              <Paper className={classes.phasePaperTitle} elevation={0} square>
                <Typography className={classes.phaseTitleText} align="center">
                  Phase 0{i+1}: {p.title}
                </Typography>
                <div className={classes.phaseDateChip}>
                <Typography className={classes.phaseDates} align="center">{(dayjs(project.vaultData.phases[i].startDate).format('DD MMMM YYYY').toUpperCase() + ' - ' + dayjs(project.vaultData.phases[i].startDate).add(p.duration, 'month').format('DD MMMM YYYY').toUpperCase())}</Typography>
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
            )}
        </Paper>
      
        <Paper className={classes.projectSection} square>
          <div className={classes.contentWrapper}>
            <Typography className={classes.sectionTitleText} align="center">Research Background</Typography>
            <Typography className={classes.contentTitleText}>
              Context and Significance
            </Typography>
            <Typography className={classes.lastUpdated}>{dayjs(project.createdAt).format('DD MMM YYYY h:mm ').toUpperCase()}</Typography>
            <Typography className={classes.contentText}>
              {project.context}
            </Typography>
            <Typography className={classes.lastUpdated} align="right">LAST UPDATED BY: {project.user.fullName && project.user.fullName.toUpperCase() + ', ' + project.user.professionalTitle.toUpperCase()}</Typography>
            <Typography className={classes.contentTitleText}>
              Approach
            </Typography>
            <Typography className={classes.lastUpdated}>{dayjs(project.createdAt).format('DD MMM YYYY h:mm ').toUpperCase()}</Typography>
            <Typography className={classes.contentText}>
              {project.approach}
            </Typography>
            <Typography className={classes.lastUpdated} align="right">LAST UPDATED BY: {project.user.fullName && project.user.fullName.toUpperCase() + ', ' + project.user.professionalTitle.toUpperCase()}</Typography>
          </div>
        </Paper>
      </Container> :
      <Container>
        Loading data
      </Container>
  )
};

export default withStyles(styles, { withTheme: true })(ProjectDetails);
