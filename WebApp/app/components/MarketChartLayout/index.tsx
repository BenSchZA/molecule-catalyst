/**
 *
 * MarketChartLayout
 *
 */

import React, { useState } from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import MarketChartD3 from 'components/MarketChartD3';
import { Link, Tabs, Tab, Paper } from '@material-ui/core';
import { Info } from '@material-ui/icons';
import { Project } from 'domain/projects/types';
import MarketHistoryChart from 'components/MarketHistoryChart';
import { ethers } from '@panterazar/ethers';
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
    charts: {
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
  });

function TabPanel(props) {
  const { children, value, index, ...classes } = props;
  
  return (
    <section hidden={value !== index} className={classes.charts}>
      {children}
      <div className={classes.info}>
        <Info fontSize="large" color="primary"/>
        <Link color="primary" variant="subtitle1">Read more about our trading technology</Link>
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
        <MarketHistoryChart
          spotPrice={Number(ethers.utils.formatEther(project.chainData.marketData.tokenPrice))}
          transactions={project.marketData.transactions} />
      </TabPanel>
      <TabPanel {...classes} value={activeTab} index={ActiveTab.BONDING}>
        <MarketChartD3
          project={project} />
      </TabPanel>
    </div>
  );
}

export default withStyles(styles)(MarketChartLayout);