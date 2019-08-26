/**
 *
 * CreatorsAwaitingReview
 *
 */

import React, { Fragment } from 'react';
import { colors } from 'theme';
import { Theme, createStyles, withStyles, WithStyles, Typography, Paper, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import CreatorApplicationDetailsView from 'components/CreatorApplicationDetailsView';
import { ExpandMore } from '@material-ui/icons';

const styles = (theme: Theme) =>
  createStyles({
    banner: {
      marginBottom: '16px',
      backgroundColor: colors.lightGrey,
      width: '100%'
    },
    maxWidth: {
      width: '1200px!important'
    },
    emptyRow: {
      height: '71px',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
      paddingTop: '12px',
      paddingLeft: '16px',
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
      paddingTop: '12px',
      paddingLeft: '16px',
    },

  });

interface OwnProps extends WithStyles<typeof styles> {
  creatorApplications: Array<{
    id: string,
    fullName: string,
    user: any,
    email: string,
    createdAt: Date,
    affiliatedOrganisation: string,
    biography: string,
    professionalTitle: string,
    profileImage: any
  }>,
  approveCreatorApplication(applicationId: string): void,
  rejectCreatorApplication(applicationId: string): void,
}

const CreatorsAwaitingReview: React.FunctionComponent<OwnProps> = (props: OwnProps) => (
  <Fragment>
    <Paper className={props.classes.banner} elevation={0}>
      <Typography variant='h5'>Awaiting Approval</Typography>
      <Paper>
        {props.creatorApplications.length > 0 ? props.creatorApplications.map(ca => (
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1bh-content"
              id="panel1bh-header">
              <Typography className={props.classes.heading}>{ca.fullName}</Typography>
              <Typography className={props.classes.secondaryHeading}>{ca.email}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <CreatorApplicationDetailsView
                rejectCreatorApplication={props.rejectCreatorApplication}
                approveCreatorApplication={props.approveCreatorApplication}
                application={ca} />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )) :
          <ExpansionPanel>
            <Typography className={props.classes.heading}>No awaiting creator applications</Typography>
          </ExpansionPanel>
        }
      </Paper>
    </Paper>
  </Fragment>
);


export default withStyles(styles, { withTheme: true })(CreatorsAwaitingReview);
