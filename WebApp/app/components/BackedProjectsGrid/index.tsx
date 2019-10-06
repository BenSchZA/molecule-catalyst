import React, { useState } from 'react';
import { compose } from 'redux';
import { Theme, WithStyles, Container, Divider, Typography } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import { Project } from 'domain/projects/types';
import BackedProjectCard from 'components/BackedProjectCard';
import TransactionModalContainer from 'containers/TransactionModalContainer';

const marginForGrid = 20;

const styles = (theme: Theme) => createStyles({
  maxWidthLg: {
    maxWidth: '1920px',
    margin: "0 auto"
  },
  divider: {
    margin: "40px auto 10px"
  },
  heading: {
    textAlign: 'center',
    maxWidth: '40vw',
    minWidth: '300px',
    paddingBottom: theme.spacing(4),
    margin: 'auto'
  },
  header: {
    font: 'Light 40px/48px Montserrat',
    fontWeight: 'lighter',
    letterSpacing: '0.29px',
    color: '#000000DE'
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`,
    maxWidth: '1980px',
    alignItems: 'center',
    "& > *": {
      margin: `0 ${marginForGrid}px ${marginForGrid * 2}px ${marginForGrid}px`
    }
  }
});

interface OwnProps extends WithStyles<typeof styles> {
  classes: any,
  projects: Array<Project>,
  userAddress: string,
  withdrawHoldings(projectId: string, tokenAmount: number): void,
}

const BackedProjectsGrid: React.FunctionComponent<OwnProps> = ({ projects, userAddress, withdrawHoldings, classes }: OwnProps) => {
  const [modalState, setModalState] = useState(false);
  const [projectId, setProjectId] = useState('');

  const closeModal = () => {
    setModalState(false);
    setProjectId('')
  }

  const showModal = (projectId: string) => {
    setProjectId(projectId);
    setModalState(true);
  }



  return (
    <>
      {
        (projectId) &&
        <TransactionModalContainer 
          projectId={projectId}
          userAddress={userAddress}
          modalState={modalState}
          handleClose={closeModal}
          mode={'redeem'} />
      }
      <Container className={classes.maxWidthLg}>
        <Typography variant='h2' className={classes.header}>My Projects</Typography>
        <Typography variant='body1' className={classes.heading}>
          Keep up to date with how your projects are developing and the value of your project tokens.
        </Typography>
        <Divider className={classes.divider} variant='middle' />
        <div className={classes.grid}>
          {projects && projects.length > 0 && projects.map((p, index) =>
            <BackedProjectCard key={index} project={p} userAddress={userAddress} openModal={() => showModal(p.id)} />
          )}
        </div>
      </Container>
    </>
  )
}

export default compose(
  withStyles(styles, { withTheme: true }),
)(BackedProjectsGrid);
