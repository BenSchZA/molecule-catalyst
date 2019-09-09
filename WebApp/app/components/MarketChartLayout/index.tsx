/**
 *
 * MarketChartLayout
 *
 */

import React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import MarketChartD3 from 'components/MarketChartD3';
import { Paper, CircularProgress, Typography, Link } from '@material-ui/core';
import { Info } from '@material-ui/icons';

// Example values:
{/* <MarketChartLayout
display={true}
marketSupplyProps={
  {
    contributionRate: 0.15,
    currentTokenValue: 5.5,
    currentTokenSupply: 100000,
  }
}
></MarketChartLayout> */}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      overflowX: 'auto',
      marginLeft: '20vw',
      marginRight: '20vw',
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
    }
  });

interface OwnProps extends WithStyles<typeof styles> {
  display: boolean,
  marketSupplyProps: {
    contributionRate: number;
    currentTokenValue: number;
    currentTokenSupply: number;
  },
};

class MarketChartLayout extends React.Component<OwnProps> {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, marketSupplyProps } = this.props;
    const { value } = this.state;

    return (
      <Paper className={classes.root}>
        <Typography variant='h4'>Market Information</Typography>
        <section className={classes.charts}>
          { value === 0 ?
              <MarketChartD3
                contributionRate={marketSupplyProps.contributionRate}
                currentTokenValue={marketSupplyProps.currentTokenValue}
                currentTokenSupply={marketSupplyProps.currentTokenSupply}/>
              : value === 0 && <CircularProgress className={classes.progress} />
          }
          <div className={classes.info}>
            <Info fontSize="large" color="primary"/>
            <Link color="primary" variant="subtitle1">Read more about our trading technology</Link>
          </div>
        </section>
      </Paper>
    );
  }
}

export default withStyles(styles)(MarketChartLayout);