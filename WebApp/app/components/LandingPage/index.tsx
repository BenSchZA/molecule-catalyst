import { Typography, WithStyles, Button, Theme } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import React from 'react';
import { compose } from 'redux';
import { forwardTo } from 'utils/history';

const styles = ({spacing}: Theme) => createStyles({
  layout: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttons: {
    paddingTop: spacing(4),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

interface Props extends WithStyles<typeof styles> {

}

const LandingPage: React.SFC<Props> = ({ classes }: Props) => {
  return (
    <main className={classes.layout}>
      <Typography variant="h1">Molecule</Typography>
      <Typography variant="body1">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum venenatis, erat vitae gravida eleifend, nunc mauris malesuada risus, eget volutpat neque quam mattis massa. Cras nec tempor odio. Quisque lacinia enim vel metus hendrerit, nec convallis metus volutpat. Mauris sapien turpis, rutrum nec purus et, euismod cursus nisi. Duis tristique urna id tellus sollicitudin rutrum. Nulla scelerisque, magna a placerat consequat, elit neque porttitor enim, a convallis ex nulla id quam. Etiam malesuada maximus tempus. Praesent sit amet dignissim mauris, at gravida est. Phasellus convallis finibus purus, vitae mollis lorem volutpat vitae. Interdum et malesuada fames ac ante ipsum primis in faucibus. Duis egestas ipsum eget consectetur efficitur. Phasellus ipsum diam, commodo lobortis turpis vitae, commodo sollicitudin ligula. Integer at nunc sit amet dolor volutpat mattis a id leo. Suspendisse odio urna, facilisis a eleifend sit amet, ultricies at ligula. Duis eget dui dui.
      </Typography>
      <Typography variant="body1">
        Phasellus id tortor quis libero venenatis congue. Nam blandit ornare leo ut gravida. Vivamus ullamcorper varius malesuada. Mauris feugiat fermentum malesuada. Quisque sed dolor sit amet quam elementum consequat ut vel nunc. Nam elementum luctus tristique. Donec nec justo arcu. Phasellus aliquet pretium sem sed malesuada. Fusce vestibulum in ligula consectetur placerat.
      </Typography>
      <Typography variant="body1">
        Nunc risus dolor, interdum nec rutrum at, malesuada a nisi. Aliquam venenatis ipsum in arcu interdum sodales. Donec imperdiet fermentum mauris ac consequat. Quisque nec enim a ipsum tristique hendrerit a nec neque. Pellentesque vitae aliquam est, a placerat ipsum. Proin porta molestie erat et porta. Aliquam sit amet magna maximus dui egestas consectetur eu nec leo. Cras tristique iaculis egestas. Phasellus ornare urna sed velit eleifend aliquam. Suspendisse laoreet neque vitae dui cursus, sit amet consequat felis pharetra. Praesent tempor venenatis mauris. Etiam vestibulum, quam a aliquet sodales, lorem arcu eleifend massa, ut imperdiet justo est quis nisl. Praesent sollicitudin turpis vitae pharetra dignissim. Suspendisse et dapibus erat. Nulla sapien risus, interdum elementum sapien vel, congue bibendum risus.
      </Typography>
      <Typography variant="body1">
        Aliquam erat volutpat. Sed ex diam, vehicula vel felis viverra, tempus placerat nisi. Etiam non tellus neque. Sed lacinia, lacus vel iaculis malesuada, justo dolor semper odio, non malesuada lectus augue et ipsum. Donec sed ultricies orci. Donec mollis metus sit amet nibh pulvinar, et finibus nulla ultricies. Curabitur fringilla iaculis libero, vel mollis magna congue eu. Praesent sollicitudin euismod nisi ut interdum. Donec sed dolor in felis posuere venenatis. Nunc iaculis pellentesque tellus quis scelerisque. Duis congue ligula sit amet nisl pulvinar, sit amet venenatis nisi pretium.
      </Typography>
      <div className={classes.buttons}>
        <Button onClick={() => forwardTo('/discover')}>Discover</Button>
        <Button>How it works</Button>
      </div>
    </main>
  );
};

const composeWithStyles = withStyles(styles, { withTheme: true });

export default compose(
  composeWithStyles,
)(LandingPage);
