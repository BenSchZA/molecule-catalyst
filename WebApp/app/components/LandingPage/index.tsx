import { Typography, WithStyles, Button, Theme, Paper, Grid, ListItem, List, ListItemIcon, ListItemText } from '@material-ui/core';
import { Accessibility, Fingerprint, SupervisorAccount } from '@material-ui/icons';
import { createStyles, withStyles } from '@material-ui/core/styles';
import React from 'react';
import { compose } from 'redux';
import { forwardTo } from 'utils/history';
import FolderIcon from '@material-ui/icons/Folder';

const styles = ({spacing}: Theme) => createStyles({
  layout: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttons: {
    paddingTop: spacing(4),
    paddingLeft: '36%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  banner:{
    marginBottom: '16px',
    backgroundColor: 'transparent',
    width: '65%'
  },
  demo: {
    backgroundColor: 'transparent',
    width: '150%'
  }
});

interface Props extends WithStyles<typeof styles> {

}

const LandingPage: React.FunctionComponent<Props> = ({ classes }: Props) => {
  const [dense] = React.useState(false);
  const [secondary] = React.useState(false);
  return (
    
    <main className={classes.layout}>
      <Paper className={classes.banner} elevation={0}>
      <Typography variant="h1">Molecule</Typography>
      <Typography variant="body1">
      Over the past year, we have been building out Molecule, a platform for buying/selling shares in pharmaceutical intellectual property. The core design goal of Molecule is to distribute the cost, risk, and rewards of drug development to allow for more diverse therapeutics to be brought to market. Molecule allows universities, pharmaceutical companies, and even patients to purchase shares in early stage pharmaceutical IP, with those funds being used to further develop that IP. We are working towards enabling new business models for drug development and commercialisation that allows previously excluded stakeholders to compete in an increasingly complex pharmaceutical landscape. </Typography>
      <Typography variant="body1">In preparation for the launch of our core protocol, we are trialing a simplified version of our technology stack known as Molecule Catalyst. Molecule Catalyst is a blockchain-based crowdfunding platform for scientific research. The primary purpose of Molecule Catalyst is to test the core technologies we have developed and apply them to fundraising for basic/fundamental research. The technologies solve an array of issues inherent to the scientific crowdfunding space: 
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div className={classes.demo}>
            <List dense={dense}>
                <ListItem>
                  <ListItemIcon>
                    <Accessibility />
                  </ListItemIcon>
                  <ListItemText
                    primary='With Molecule Catalyst, fundraising campaigns are split into several short-term milestones and deliverables, effectively reducing required funding amounts for different phases, and thus, also reducing the initial risk for funders. This also improves trust between funders and recipients.'
                    secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Fingerprint />
                  </ListItemIcon>
                  <ListItemText
                    primary='We are working on novel crypto-economic schemas to incentivising funding, allowing “traders” to potentially earn a return simply by funding research.'
                    secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SupervisorAccount />
                  </ListItemIcon>
                  <ListItemText
                    primary='Token Bonding Curves (TBCs) allow for a continuous fundraising approach, encouraging researchers to fulfill milestones and update backers as soon as possible.'
                    secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary='The use of TBCs shifts interest building to the funder side, since they can profit from growing contributor base.'
                    secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary='Fund distribution, backer redemption and fee-taking is based on public, automated smart contracts that reduce platform mistrust, operational cost and fees significantly.'
                    secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
            </List>
          </div>
        </Grid>
      </Grid>
      <Typography variant="body1">
      We are currently searching for early projects to launch as the core offerings for Molecule Catalyst. We are looking for basic research projects that are looking to raise between $10,000 - $50,000USD to carry out work in the following research areas: </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div className={classes.demo}>
            <List dense={dense}>
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary='Rare, Neglected, and Pediatric Illness'
                    secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary='Ageing and Longevity'
                    secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary='Antimicrobial Resistance/Novel Antibiotics'
                    secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary='Psychedelic Studies'
                    secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary='Working on another interesting therapeutic? Contact us!'
                    secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
            </List>
          </div>
        </Grid>
      </Grid>
      <div className={classes.buttons}>
        <Button onClick={() => forwardTo('/discover')}>Discover</Button>
        <Button >How it works</Button>
      </div>
      </Paper>
    </main>

  );
};

const composeWithStyles = withStyles(styles, { withTheme: true });

export default compose(
  composeWithStyles,
)(LandingPage);
