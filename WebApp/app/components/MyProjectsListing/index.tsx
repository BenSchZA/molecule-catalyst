/**
 *
 * AdminProjectListing
 *
 */

import React, { Fragment } from 'react';
import { withStyles, WithStyles, Typography, TableHead, Table, TableCell, TableBody, TableRow, Button, Paper, Modal, Divider } from '@material-ui/core';
import { ProjectSubmissionStatus, Project, FundingState } from '../../domain/projects/types';
import dayjs from 'dayjs'
import { PositiveButton, NegativeButton } from 'components/custom';
import styles from './styles';
import { ethers } from 'ethers';
import { bigNumberify } from 'ethers/utils';
import MoleculeSpinner from 'components/MoleculeSpinner/Loadable';


interface OwnProps extends WithStyles<typeof styles> {
  myProjects: Array<Project>,
  withdrawFunding(projectId: string): void,
  txInProgress: boolean,
}

const MyProjectsListing: React.FunctionComponent<OwnProps> = (props: OwnProps) => {
  const [open, setOpen] = React.useState(false);
  const [projectId, setProjectId] = React.useState('');
  const [withdrawDetails, setWithdrawDetails] = React.useState({
    outstandingWithdraw: 0,
    availableFunding: 0,
    fee: 0,
    withdrawalAmount: 0,
  });

  function handleOpen(projectId: string) {
    setOpen(true);
    setProjectId(projectId);
    setWithdrawDetails(() => {
      const currentProject = props.myProjects.filter((item) => item.id === projectId)[0] as Project;

      const availableFundingBN = currentProject ?
        currentProject.vaultData.phases.filter(value => value.state == FundingState.ENDED).reduce((previousValue, currentValue, currentIndex, array) => {
          return bigNumberify(previousValue).add(currentValue.fundingThreshold);
        }, bigNumberify(0)) : bigNumberify(0);

      const availableFunding = currentProject ?
        Number(ethers.utils.formatEther(availableFundingBN)) : 0;
      const outstandingWithdraw = currentProject ?
        Number(ethers.utils.formatEther(currentProject.vaultData.outstandingWithdraw)) : 0;

      const fee = availableFunding - outstandingWithdraw;
      const withdrawalAmount = availableFunding - fee;

      return {
        outstandingWithdraw: outstandingWithdraw,
        availableFunding: availableFunding,
        fee: fee,
        withdrawalAmount: withdrawalAmount,
      }
    });
  }

  function handleClose() {
    setOpen(false);
  }

  function handleWithdraw() {
    props.withdrawFunding(projectId);
    setOpen(false);
  }

  return (
    <Fragment>
      <Paper className={props.classes.banner} elevation={0}>
        <div className={props.classes.overlay} style={{ display: (props.txInProgress) ? "block" : "none" }}>
          <div className={props.classes.spinner}>
            <MoleculeSpinner />
          </div>
        </div>
        <Typography variant='h5'>Projects</Typography>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Project Title</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.myProjects && props.myProjects.length > 0 ? props.myProjects.map(project => (
                <TableRow key={project.id} >
                  <TableCell className={props.classes.rowText}>{project.title}</TableCell>
                  <TableCell className={props.classes.rowText}>{dayjs(project.createdAt).format('YYYY-MM-DD HH:mm')}</TableCell>
                  <TableCell className={props.classes.rowText}>{ProjectSubmissionStatus[project.status].toUpperCase()}</TableCell>
                  <TableCell>
                    {(() => {
                      switch (project.status) {
                        case ProjectSubmissionStatus.started:
                          return Number(ethers.utils.formatEther(bigNumberify(project.vaultData.outstandingWithdraw))) > 0 ?
                            <Button className={props.classes.actionButton} onClick={() => handleOpen(project.id)}>Withdraw</Button> : '-';
                        default:
                          return '-';
                      }
                    })()}
                  </TableCell>
                </TableRow>
              )) :
                <TableRow className={props.classes.emptyRow}>
                  <TableCell>No projects</TableCell>
                </TableRow>}
            </TableBody>
          </Table>
        </Paper>
      </Paper>
      <Modal
        onClose={handleClose}
        open={open}
      >
        <Paper square={false} className={props.classes.modal}>
          <div className={props.classes.modalTitle}>
            <Typography variant="h2">Withdraw Funding</Typography>
          </div>
          <div className={props.classes.table}>
            <Typography variant="body1">
              Available Funding:
            </Typography>
            <Typography variant="body1">{withdrawDetails.availableFunding} Dai</Typography>
            <Typography variant="body1">
              Fee:
            </Typography>
            <Typography variant="body1">{withdrawDetails.fee} Dai</Typography>
          </div>
          <Divider />
          <div className={props.classes.table}>
            <Typography variant="body1">
              Total Withdrawal Amount:
            </Typography>
            <Typography variant="body1">
              {withdrawDetails.withdrawalAmount} Dai
            </Typography>
          </div>
          <div className={props.classes.buttons}>
            <NegativeButton onClick={handleClose}>Cancel</NegativeButton>
            <PositiveButton disabled={false} onClick={handleWithdraw}>Withdraw</PositiveButton>
          </div>
        </Paper>
      </Modal>
    </Fragment>
  )
};


export default withStyles(styles, { withTheme: true })(MyProjectsListing);
