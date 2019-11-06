/**
 *
 * MobileSplashscreen
 *
 */

import React from 'react';
import { Theme, createStyles, withStyles, WithStyles, Typography, Link } from '@material-ui/core';
import ReactSVG from 'react-svg';

const styles = (theme: Theme) =>
  createStyles({
    background: {
      backgroundColor: theme.palette.primary.main,
      height: '100vh',
      padding: theme.spacing(2),
      textAlign: 'center'
    },
    text: {
      color: '#FFF'
    }
  });

interface OwnProps extends WithStyles<typeof styles> { }

const MobileSplashscreen: React.FC<OwnProps> = ({classes}: OwnProps) =>
  <div className={classes.background}>
    <ReactSVG src="/molecule-catalyst-logo.svg" beforeInjection={(svg) => svg.setAttribute('style', 'width: 300px')} />
    <Typography className={classes.text}>
      This application is not accessible on mobile devices. Please try again from a desktop device.
    </Typography>
    <hr />
    <Link href='https://catalyst.molecule.to/' className={classes.text}>
      More Information
    </Link>
  </div>;

export default withStyles(styles, { withTheme: true })(MobileSplashscreen);
