/**
 *
 * ErrorBoundary
 *
 */

import React from 'react';
import UnauthorizedPage from 'components/UnauthorizedPage';

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
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // TODO: Log to APM here
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <UnauthorizedPage />;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
