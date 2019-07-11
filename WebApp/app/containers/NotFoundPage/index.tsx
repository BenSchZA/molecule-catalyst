/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import { Typography } from '@material-ui/core';
import React, {Fragment} from 'react';

// const CreateOrganisationForm: React.SFC<OwnProps> = (props: OwnProps) =>

const NotFound: React.SFC = () => (
    <Fragment>
      <Typography variant="h1">
        These are not the droid you are looking for
      </Typography>
    </Fragment>
  );

export default NotFound;
