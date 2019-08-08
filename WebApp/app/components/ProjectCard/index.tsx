/**
 *
 * ProjectCard
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, CardContent, Card, CardHeader, CardMedia, Typography, CardActions } from '@material-ui/core';
import { colors } from 'theme';

const styles = (theme: Theme) =>
  createStyles({
    altRow: {
      backgroundColor: colors.grey,
    },
    avatar: {
      backgroundColor: 'red',
    },
    card: {
      maxWidth: 450,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    }
  });

interface OwnProps extends WithStyles<typeof styles> {
  project: any
}

const ProjectCard: React.FunctionComponent<OwnProps> = ({ project, classes }: OwnProps) => (
  <Fragment>
     <Card className={classes.card}>
      <CardHeader
        title="Name of Project"
        subheader="ONGOING"
      />
       <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          This impressive paella is a perfect party dish and a fun meal to cook together with your
          guests. Add 1 cup of frozen peas along with the mussels, if you like.
        </Typography>
        <Typography variant="h3">55%</Typography>
      </CardContent>
      <CardMedia
        className={classes.media}
        image="/static/images/cards/paella.jpg"
        title="Paella dish"
      />
      <CardActions disableSpacing>
       
      </CardActions>
    </Card>
  </Fragment>
);

export default withStyles(styles, { withTheme: true })(ProjectCard);
