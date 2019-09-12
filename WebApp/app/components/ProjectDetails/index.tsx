/**
 *
 * ProjectDetails
 *
 */

import React from 'react';
import { Theme, createStyles, withStyles, WithStyles, Container, Typography, Button, Paper, Divider, Grid, Avatar, Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import { Project, ProjectSubmissionStatus } from 'domain/projects/types';
import apiUrlBuilder from 'api/apiUrlBuilder';
import { Face } from '@material-ui/icons';
import { colors } from 'theme';
import ProjectPhaseStatus from 'components/ProjectPhaseStatus';
import { fade } from '@material-ui/core/styles';
import ProjectSupportModal from 'components/ProjectSupportModal';
import { FormikProps, FormikValues } from 'formik';
import MarketChartLayout from 'components/MarketChartLayout';
import dayjs from 'dayjs';
import { ethers } from 'ethers';

// Settings
const bannerFooterAccentHeight = 5;
const avatarSize = 80;
const contentPadding = 40;
const fundingStatsSpacing = 10;

const styles = ({ spacing, palette }: Theme) =>
  createStyles({
    projectSection: {
      padding: `${spacing(4)}px ${spacing(8)}px`,
    },
    bannerWrapper: {
      position: 'relative',
      "&:after": {
        content: "''",
        display: "block",
        position: "absolute",
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        background: colors.moleculeBranding.primary,
        zIndex: 1,
        opacity: 0.69,
      }
    },
    bannerImage: {
      width: '100%',
    },
    bannerContent: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      left: '50%',
      top: '35%',
      transform: 'translate(-50%, -50%)',
      zIndex: 2,
      color: colors.white
    },
    bannerFooter: {
      width: '100%',
      height: "60px",
      display: 'flex',
      flexDirection: 'row',
      justifyContent: "space-between",
      alignItems: "center",
      position: 'absolute',
      left: '50%',
      bottom: 0,
      transform: 'translate(-50%, 0)',
      zIndex: 3,
      color: colors.white,
      padding: `0 ${contentPadding}px`,
      "& > *":{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        height: "100%",
        "&:first-child":{ // Left
          "& > *:last-child":{ // Profile name
          marginLeft: 20
          }
        },
        "&:last-child":{ // Right

        }
      },
      "&:before":{
        content: "''",
        display: "block",
        background: fade(colors.moleculeBranding.primary, 0.63),
        zIndex: -1,
        height: "100%",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        borderTop: `${bannerFooterAccentHeight}px solid ${fade(colors.moleculeBranding.primary, 0.70)}`
      },

      "& h6":{
        fontSize: "12px",
      }
    },
    researcherAvatar: {
      position: 'relative',
      width: avatarSize,
      height: "100%",
      "& > *":{
        position: "absolute",
        display: "block",
        top: bannerFooterAccentHeight ? bannerFooterAccentHeight : 0,
        left: "50%",
        transform: "translate(-50%, -50%)",
        height: avatarSize,
        width: avatarSize
      }
    },
    fundingStatusSection: {
      width: `calc(100% + ${spacing(16)}px)`,
      position: "relative",
      left: "50%",
      transform: "translate(-50%, 0)",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "stretch",
      padding: `${fundingStatsSpacing* 2}px ${avatarSize}px`,
      "&:before":{ // Background
        content: "''",
        display: "block",
        backgroundColor: colors.whiteAlt,
        height: "100%",
        width: "100%",
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translate(-50%, 0)"
      },
      "& > *":{ // Cells
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: `0 ${fundingStatsSpacing}px`,
        position: "relative",
        flexGrow: 1,
        "& p":{
          padding: "2.5px 0"
        },
        "&:after":{
          content: "''",
          display: "block",
          height: "100%",
          width: 1,
          position: "absolute",
          right: 0,
          backgroundColor: palette.secondary.main
        },
        "&:last-child:after":{
          display: "none"
        }
      }
    },
    fundingStatusItem: {
      borderRight: '1px',
      borderRightColor: palette.secondary.main,
    },
    fundingPhaseSection:{
      padding: 0
    },
    projectProgress: {
      paddingTop: spacing(1),
      paddingBottom: spacing(1),
      color: palette.secondary.main,
      font: '44px/54px Montserrat',
      letterSpacing: '-0.39px',
      opacity: 1
    },
    fundingLabels: {
      font: 'Bold 12px/15px Montserrat',
      fontWeight: "bolder",
      letterSpacing: '1.07px',
      color: '#000000DE',
      opacity: 1,
      textTransform: 'uppercase'
    },
    fundingAmount: {
      font: 'Bold 18px/24px Montserrat',
      fontWeight: "bolder",
      letterSpacing: '0',
      color: '#000000DE',
      opacity: 1
    },
    contentWrapper:{
      paddingLeft: avatarSize,
      paddingRight: avatarSize,
      paddingTop: avatarSize/2,
    },
    fullWidthSection: {
      width: `calc(100% + ${spacing(16)}px)`,
      backgroundColor: colors.whiteAlt,
      marginLeft: -spacing(8),
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      paddingTop: spacing(4),
      paddingBottom: spacing(4),
    },
    phasePaperTitle: {
      width: `calc(100% + ${spacing(16)}px)`,
      backgroundColor: colors.whiteAlt,
      marginLeft: -spacing(8),
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: spacing(4),
      paddingTop: spacing(6),
      marginTop: spacing(2),
      height: 175
    },
    phaseTitleText: {
      textAlign: 'center',
      font: '30px/37px Montserrat',
      letterSpacing: '-0.26px',
      color: '#000000DE',
      opacity: 1.0,
      paddingTop: spacing(2),
      marginTop: spacing(2)
    },
    avatar: {
      paddingTop: spacing(2),
      paddingBottom: spacing(1.5),
      width: 135,
      height: "100%",
      "& > *":{
        height: 135,
        width: 135
      }
    },
    phaseDateChip: {
      paddingTop: spacing(2),
      paddingBottom: spacing(1.5),
      width: 600,
      height: "100%",
      "& > *":{
        height: 135,
        width: 135
      }
    },
    projectLeadTitleText: {
      textAlign: 'center',
      font: '30px/37px Montserrat',
      letterSpacing: '-0.26px',
      color: '#000000DE',
      opacity: 1.0,
    },
    projectLeadText: {
      textAlign: 'center',
      font: '14px/20px Roboto',
      letterSpacing: '0.09px',
      color: '#00000099',
      opacity: 1.0
    },
    sectionTitleText: {
      paddingTop: spacing(8),
      paddingBottom: spacing(4),
      textAlign: 'center',
      font: '30px/37px Montserrat',
      letterSpacing: '-0.26px',
      color: '#000000DE',
      opacity: 1.0,
    },
    contentText: {
      textAlign: 'left',
      font: '18px/24px Roboto',
      letterSpacing: '0.17px',
      color: '#00000099',
      opacity: 1.0,
      paddingBottom: spacing(2),
      paddingTop: spacing(2),
    },
    contentTitleText: {
      fontWeight: 'bolder',
      textAlign: 'left',
      font: '18px/24px Montserrat',
      letterSpacing: 0,
      color: '#000000DE',
      opacity: 1.0,
      paddingBottom: "2px",
      paddingTop: avatarSize / 4,
    },
    startDate: {
      font: "14px Montserrat",
      fontWeight: "bolder"
    },
    abstract: {
      font: "18px/24px Montserrat",
      fontWeight: "bold",
      paddingBottom: "2px"
    },
    lastUpdated: {
      font: "12px Montserrat",
      fontWeight: "bold",
      letterSpacing: "1.88px",
      color: "#00000099",
      opacity: 0.39
    },
    phaseDates: {
      font: "12px/15px Montserrat",
      fontWeight: "bold",
      letterSpacing: "1.88px",
      color: "#00000099",
      opacity: 1,
      width: '100%',
    },
    abstractText:{
      font: "18px Roboto",
      letterSpacing: "0.17px",
      color: "#00000099",
      paddingTop: 15
    },
    fundingStatus:{
      paddingBottom: avatarSize/2
    },
    divider:{
      margin: "24px auto 32px !important",
      backgroundColor: colors.moleculeBranding.third,
      alignSelf: 'center',
      verticalAlign: 'middle',
      height: 2,
      width: 1150
    },
    projectTitle:{
      textAlign: "center",
      font: "Bold 60px/65px Montserrat",
      letterSpacing: "0.43px",
      color: "#FFFFFF",
      textShadow: "0px 3px 6px #0000004E",
      opacity: 1,
      width: '1100px',
      paddingTop: avatarSize*1
    },
    supportProject: {
      background: '#FFFFFF 0% 0% no-repeat padding-box',
      boxShadow: '0px 1px 3px #00000033',
      borderRadius: '4px',
      textAlign: 'center',
      font: 'Bold 14px/24px Montserrat',
      letterSpacing: '0.18px',
      color: '#003E52',
    },
    redeemHoldings: {
      background: '#03DAC6 0% 0% no-repeat padding-box',
      boxShadow: '0px 1px 3px #00000033',
      borderRadius: '4px',
      textAlign: 'center',
      font: 'Bold 14px/24px Montserrat',
      letterSpacing: '0.18px',
      color: '#FFFFFF'
    }
  });

interface OwnProps extends WithStyles<typeof styles> {
  project: Project,
  daiBalance: number,
  formikProps: FormikProps<FormikValues>,
}

const ProjectDetails: React.FunctionComponent<OwnProps> = ({ 
    project, 
    daiBalance, 
    classes,
    formikProps,
  }: OwnProps) => {

  const [open, setOpenModal] = React.useState(false);

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    (project && project.chainData && project.chainData.marketData) ?
      <Container maxWidth='lg'>
        <ProjectSupportModal
          daiBalance={daiBalance}
          closeModal={handleClose}
          modalState={open}
          contributionRate={project.chainData.marketData.taxationRate}
          formikProps={formikProps}
        />
        <div className={classes.bannerWrapper}>
          <img src={apiUrlBuilder.attachmentStream(project.featuredImage)} className={classes.bannerImage} />
          <div className={classes.bannerContent}>
            <Typography className={classes.projectTitle}>{project.title}</Typography>
            <div>
              <Button className={classes.supportProject} onClick={handleOpen}>Support Project</Button>
              <Button className={classes.redeemHoldings} onClick={() => console.log('sell')}>Redeem Holdings</Button>
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
              {(Number.parseInt(ethers.utils.formatEther(project.vaultData.totalRaised)) / project.researchPhases.reduce((projectTotal, phase) => projectTotal += phase.fundingGoal, 0) * 100)} %
              </Typography>
            </div>
            <div>
              <Typography className={classes.fundingLabels}> 
                Total Funding Goal
              </Typography>
              <Typography className={classes.fundingAmount}>
                {project.researchPhases.reduce((projectTotal, phase) => projectTotal += phase.fundingGoal, 0).toLocaleString()} USD
              </Typography>
            </div>
            <div>
              <Typography className={classes.fundingLabels}>
                Total Pledged
              </Typography>
              <Typography className={classes.fundingAmount}>
                {~~ethers.utils.formatEther(project.vaultData.totalRaised).toLocaleString()} USD
              </Typography>
            </div>
            <div>
              <Typography className={classes.fundingLabels}>
                Total Released
              </Typography>
              <Typography className={classes.fundingAmount}>
                {(project.vaultData.activePhase == 0 ? 0 : project.researchPhases[1].fundingGoal).toLocaleString()} USD
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
                <Typography className={classes.phaseDates} align="center">{dayjs(project.createdAt).format('DD MMMM YYYY').toUpperCase() + ' - ' + dayjs(project.createdAt).add(p.duration, 'month').format('DD MMMM YYYY').toUpperCase()}</Typography>
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
