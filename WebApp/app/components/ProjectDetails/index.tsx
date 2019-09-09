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

// Settings
const bannerFooterAccentHeight = 5;
const avatarSize = 80;
const contentPadding = 40;
const fundingStatsSpacing = 10;

const styles = ({ spacing, palette }: Theme) =>
  createStyles({
    projectSection: {
      padding: spacing(4),
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
      width: `calc(100% + ${spacing(8)}px)`,
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
    },
    contentWrapper:{
      paddingLeft: avatarSize,
      paddingRight: avatarSize,
      paddingTop: avatarSize / 4
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
            <Typography variant='h2'>{project.title}</Typography>
            <div>
              <Button onClick={handleOpen}>Support Project</Button>
              <Button onClick={() => console.log('sell')}>Redeem Holdings</Button>
            </div>
          </div>
          <div className={classes.bannerFooter}>
            <div>
              <div className={classes.researcherAvatar} >
                <Avatar src={project.user.profileImage && apiUrlBuilder.attachmentStream(project.user.profileImage)}>
                  {!project.user.profileImage && <Face fontSize='large' />}
                </Avatar>
              </div>
              <Typography variant='h6'>{project.user.fullName && project.user.fullName.toUpperCase()}</Typography>
            </div>
            <div>
              <Typography variant='h6' align='right'>{project.user.affiliatedOrganisation && project.user.affiliatedOrganisation.toUpperCase()}</Typography>
            </div>
          </div>
        </div>
        <Paper className={classes.projectSection} square>
          <Grid container>
            <Grid item xs={6}>
              <Typography variant='h6'>START DATE: {('Date').toUpperCase()}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='h6' align='right'>STATUS: {ProjectSubmissionStatus[project.status].toUpperCase()}</Typography>
            </Grid>
          </Grid>
          <Divider />
          <div className={classes.contentWrapper}>
            <Typography variant='h6'>Abstract</Typography>
            <Typography paragraph>{project.abstract}</Typography>
          </div>
          <Typography variant='h4' align="center">Funding Status</Typography>
          <article className={classes.fundingStatusSection} >
            <div>
              <Typography variant='h2' className={classes.projectProgress}>
                95.0%
              </Typography>
            </div>
            <div>
              <Typography>
                Total Funding Goal
              </Typography>
              <Typography>
                55000 USD
              </Typography>
            </div>
            <div>
              <Typography>
                Total Pledged
              </Typography>
              <Typography>
                50000 USD
              </Typography>
            </div>
            <div>
              <Typography>
                Total Released
              </Typography>
              <Typography>
                45000 USD
              </Typography>
            </div>
            <div>
              <Typography>
                Total Duration Left
              </Typography>
              <Typography>
                35 Days
              </Typography>
            </div>
          </article>
          <div className={classes.contentWrapper}>
            <Grid className={classes.fundingPhaseSection} container direction='row' alignItems='center' justify='center' spacing={4}>
              {project.researchPhases && project.researchPhases.map((p, i) =>
                <ProjectPhaseStatus key={i+1} phase={{
                  index: i+1,
                  daysRemaining: 10,
                  fundedAmount: 5000,
                  fundingGoal: p.fundingGoal,
                  title: p.title,
                  status: 'Released'
                }} />
              )}
            </Grid>
          </div>
          <div className={classes.contentWrapper}>
            <Typography variant='h4' align="center">Market</Typography>
            <MarketChartLayout
              display={true}
              project={project}
            />
          </div>
        </Paper>
        <Paper className={classes.projectSection} square>
          <div className={classes.contentWrapper}>
            <Typography variant='h4' align="center">Research Background</Typography>
            <Typography variant='subtitle2'>What is the significance of your research</Typography>
            <Typography>{project.context}</Typography>
            <Typography variant='subtitle2'>What is the experimental approach for this reseach initiative</Typography>
            <Typography>{project.approach}</Typography>
          </div>
        </Paper>
        <Paper className={classes.projectSection} square>
          <div className={classes.contentWrapper}>
            <Typography variant='subtitle2'>Contributors</Typography>
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
      </Container> :
      <Container>
        Loading data
      </Container>
  )
};

export default withStyles(styles, { withTheme: true })(ProjectDetails);
