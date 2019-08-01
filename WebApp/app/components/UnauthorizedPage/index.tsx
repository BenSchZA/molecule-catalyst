/**
 *
 * UnauthorizedPage
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, Typography, Button, Divider, Card } from '@material-ui/core';
import {colors} from 'theme';

const styles = (theme: Theme) =>
  createStyles({
    failureCard:{
      alignItems: 'center',
      backgroundColor: colors.white,
      
    },
    button: {
      marginLeft:'45.65%'
    },
    failureImg: {
      marginLeft:'36%'
    }
  });

interface OwnProps extends WithStyles<typeof styles> {}

const UnauthorizedPage: React.SFC<OwnProps> = (props: OwnProps) => {
  return <Fragment>
   <Typography variant='h2'>
   Your experiment failed...
   </Typography>
   <Card elevation={0} className={props.classes.failureCard}><img className={props.classes.failureImg} src="https://38.media.tumblr.com/cff855d2b0012f62e7052e81af626601/tumblr_nhqb7zKiZv1skgrjxo1_500.gif"></img></Card>
   <Button  size='large' className={props.classes.button}>Go Discover</Button>
   <Divider variant='middle'/>
 </Fragment>;
};

export default withStyles(styles, { withTheme: true })(UnauthorizedPage);
