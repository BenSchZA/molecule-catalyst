/**
 *
 * MarketChartLayout
 *
 */

import React, { useState } from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import MarketChartD3 from 'components/MarketChartD3';
import { Link, Tabs, Tab, Paper, Typography } from '@material-ui/core';
import { Info } from '@material-ui/icons';
import { Project } from 'domain/projects/types';
import MarketHistoryChart from 'components/MarketHistoryChart';
import { colors } from 'theme';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      overflowX: 'auto',
      marginLeft: '10px',
      marginRight: '10px',
      marginBottom: '20px',
      padding: theme.spacing(2),
    },
    chip: {
      margin: theme.spacing(2)
    },
    progress: {
      margin: theme.spacing(2),
      position: 'relative',
      marginLeft: '50%',
    },
    info: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '100px',
    },
    fullWidthSection: {
      width: `calc(100% + ${theme.spacing(16)}px)`,
      backgroundColor: colors.whiteAlt,
      marginLeft: -theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    projectSection: {
      padding: `${theme.spacing(4)}px ${theme.spacing(8)}px`,
    },
    sectionTitleText: {
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(4),
      textAlign: 'center',
      font: '30px/37px Montserrat',
      letterSpacing: '-0.26px',
      color: '#000000DE',
      opacity: 1.0,
    },
    explainerText: {
      font: 'Regular 18px/24px Roboto',
      paddingBottom: '28px',
      fontWeight: theme.typography.fontWeightRegular,
      textAlign: 'left',
      letterSpacing: '0.17px',
      color: '#00000099',
      opacity: 1,
    },
    layout: {
      width: 'auto',
      // display: 'block', // Fix IE 11 issue.
      paddingTop: theme.spacing(10),
      paddingLeft: theme.spacing(15),
      paddingRight: theme.spacing(15),
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
  });

function TabPanel(props) {
  const { children, value, index, ...classes } = props;

  return (
    <section className={classes.layout} hidden={value !== index}>
      {children}
      <div className={classes.info}>
        <Info fontSize="large" color="primary" />
        <Link
          color="primary"
          variant="subtitle1" 
          href="https://catalyst.molecule.to/learn"
          target="_blank"
          rel="noreferrer">
            Read more about our fundraising technology
        </Link>
      </div>
    </section>
  );
}

const CustomTabs = withStyles({
  root: {
    background: '#EAEBEC 0% 0% no-repeat padding-box',
    borderRadius: '10px 10px 0px 0px',
  },
  indicator: {
    top: 0,
    display: 'flex',
    justifyContent: 'center',
    background: '#03DAC6 0% 0% no-repeat padding-box',
    borderRadius: '0px 0px 10px 10px',
    height: '9px',
    transform: 'matrix(-1, 0, 0, -1, 0, 0)',
  },
})(Tabs);

const CustomTab = withStyles({
  root: {
    textTransform: 'uppercase',
    minWidth: 72,
    padding: '50px',
    letterSpacing: '1.07px',
    background: '#EAEBEC 0% 0% no-repeat padding-box',
    borderRadius: `0px 0px 0px 0px`,
    font: 'Bold 12px/15px Montserrat',
    '&:hover': {
      color: '#03DAC6',
      opacity: 1,
    },
    '&$selected': {
      background: '#FFFFFF 0% 0% no-repeat padding-box',
      borderRadius: '10px 10px 0px 0px',
    },
    '&:focus': {
      // color: '#03DAC6',
    },
  },
  selected: {},
})(Tab);

interface OwnProps extends WithStyles<typeof styles> {
  display: boolean,
  project: Project,
};

enum ActiveTab {
  HISTORY,
  BONDING
}

const MarketChartLayout: React.FunctionComponent<OwnProps> = (props: OwnProps) => {
  const { classes, project } = props;
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.HISTORY);

  return (
    <div>
      <Paper className={classes.fullWidthSection} elevation={0} square>
        <CustomTabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
          <CustomTab label="Change in project token price" />
          <CustomTab label="Current project token price" />
        </CustomTabs>
      </Paper>
      <TabPanel {...classes} value={activeTab} index={ActiveTab.HISTORY}>
        <Typography className={classes.explainerText}>
          <b>The price for project tokens changes</b> when tokens are distributed&nbsp;
          for additional contributions or when contributors decide to sell the ones they own.
        </Typography>
        <Typography className={classes.explainerText}>
          An <b>increasing</b> project token price shows that <b>contributors are confident</b>&nbsp;
          about the Research Project and the fundraising campaign success. A&nbsp;
          <b>declining</b> price might indicate that the <b>contributors are starting&nbsp;
          to doubt</b> the research projectand are selling their project tokens.
        </Typography>
        <MarketHistoryChart
          project={project} />
      </TabPanel>
      <TabPanel {...classes} value={activeTab} index={ActiveTab.BONDING}>
        <Typography className={classes.explainerText}>
          <b>The price of project tokens is determined</b> by the number of tokens that&nbsp;
          are in circulation and and the accumulated amount of Dai in the project stake reserve.
          </Typography>
        <Typography className={classes.explainerText}>
          Depending on this snapshot of the market below&nbsp;
            <b>you can decide whether you want to buy or sell your tokens</b> and see what&nbsp;
    indications they have depending on the overall performance of the project market.
          </Typography>
        <MarketChartD3
          project={project} />
      </TabPanel>
    </div>
  );
}

export default withStyles(styles)(MarketChartLayout);