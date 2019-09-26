/**
 *
 * DaiIcon
 *
 */

import React from 'react';
import { Theme, createStyles, withStyles, WithStyles } from '@material-ui/core';
import ReactSVG from 'react-svg';


const styles = (theme: Theme) =>
  createStyles({
    // JSS in CSS goes here
  });

interface OwnProps extends WithStyles<typeof styles> {
  height?: number;
}

const DaiIcon: React.FunctionComponent<OwnProps> = (props: OwnProps) => (
  <ReactSVG src='/dai-icon.svg' beforeInjection={(svg) => props.height && svg.setAttribute('style', `height: ${props.height}px`)}/>
);

export default withStyles(styles, { withTheme: true })(DaiIcon);
