/**
 *
 * TransactionSuccessNotification
 *
 */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import { Twitter, Facebook, CheckCircleOutline } from '@material-ui/icons';
import { CardContent } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  content: {
    padding: theme.spacing(2),
    backgroundColor: '#43a047',
    color: 'white',
  },
  actions: {
    padding: theme.spacing(0),
    display: 'flex',
    backgroundColor: '#43a047',
    justifyContent: 'space-around',
  },
  icon: {
    color: 'white',
  },
  button: {
    padding: 0,
    textTransform: 'none',
  },
}));

interface OwnProps {
  projectName: string
}

const TransactionSuccessNotification: React.FunctionComponent<OwnProps> =
  React.forwardRef(({ projectName }: OwnProps, ref) => {
    const classes = useStyles();

    const url = window.location.href;
    const text = 
`Support the next therapeutic breakthrough.
@Molecule_to #blockchain #crowdfunding #science #defi`;

    return (
      <Card ref={ref}>
        <CardContent className={classes.content}>
          <Typography><CheckCircleOutline /> Successfully funded project</Typography>
        </CardContent>
        <CardActions className={classes.actions}>
          <IconButton className={classes.icon} onClick={() => {
            window.open('https://twitter.com/share?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text),
              '',
              'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
          }} >
            <Twitter />
          </IconButton>
          <IconButton className={classes.icon} onClick={() => {
            window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url) + '&quote=' + encodeURIComponent(text),
              '',
              'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
          }}>
            <Facebook />
          </IconButton>
        </CardActions>
      </Card>
    );
  });


export default TransactionSuccessNotification;


