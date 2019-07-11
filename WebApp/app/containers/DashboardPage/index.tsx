/**
 *
 * DashboardPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Dashboard from 'components/Dashboard';

function DashboardPage() {
  return (
    <Dashboard />
  );
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: dispatch,
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(DashboardPage);
