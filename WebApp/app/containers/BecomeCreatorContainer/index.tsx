/**
 *
 * BecomeCreatorContainer
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, Dispatch } from 'redux';
import { Typography } from '@material-ui/core';

// import injectSaga from 'utils/injectSaga';
// import injectReducer from 'utils/injectReducer';
// import reducer from './reducer';
// import saga from './saga';
import makeSelectBecomeCreatorContainer from './selectors';

interface OwnProps {}

interface DispatchProps {}

interface StateProps {}

type Props = StateProps & DispatchProps & OwnProps;

const BecomeCreatorContainer: React.FunctionComponent<Props> = (props: Props) => {
  return <Fragment>
    <Typography>
      Become Creator Container
    </Typography>
  </Fragment>;
};

const mapStateToProps = createStructuredSelector({
  becomeCreatorContainer: makeSelectBecomeCreatorContainer(),
});

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => {
  return {
    dispatch: dispatch,
  };
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// // Remember to add the key to ./app/types/index.d.ts ApplicationRootState
// // <OwnProps> restricts access to the HOC's other props. This component must not do anything with reducer hoc
// const withReducer = injectReducer<OwnProps>({
//   key: 'becomeCreatorContainer',
//   reducer: reducer,
// });
// // <OwnProps> restricts access to the HOC's other props. This component must not do anything with saga hoc
// const withSaga = injectSaga<OwnProps>({
//   key: 'becomeCreatorContainer',
//   saga: saga,
// });

export default compose(
  // withReducer,
  // withSaga,
  withConnect,
)(BecomeCreatorContainer);
