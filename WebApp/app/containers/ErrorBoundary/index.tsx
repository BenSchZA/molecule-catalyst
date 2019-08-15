/**
 *
 * ErrorBoundary
 *
 */

import React from 'react';

interface OwnProps {}
interface StateProps {}
interface DispatchProps {}
interface State {
  hasError: boolean,
}

type Props = StateProps & DispatchProps & OwnProps;

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // TODO: Log to APM here
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
