/**
 *
 * ProjectCreationConfirmation
 *
 */

import React from 'react';
import { Theme, createStyles, withStyles, WithStyles, Typography, Container } from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    // JSS in CSS goes here
  });

interface OwnProps extends WithStyles<typeof styles> {}

const ProjectCreationConfirmation: React.SFC<OwnProps> = (props: OwnProps) => (
  <Container maxWidth='md'>
    <Typography variant='h2'>Project submitted successfully</Typography>
    <Typography>Our team is busy reviewing your project. You will be notified once the project has been approved.</Typography>
  </Container>
);

export default withStyles(styles, { withTheme: true })(
  ProjectCreationConfirmation,
);
