/**
 *
 * ErrorBoundary
 *
 */

import React from 'react';
import UnauthorizedPage from 'components/UnauthorizedPage';
import * as Sentry from '@sentry/browser';
import { withRouter } from 'react-router';
import history from 'utils/history';

interface OwnProps {}
interface StateProps {}
interface DispatchProps {}
interface State {
  hasError: boolean,
  eventId: string | undefined,
}

type Props = StateProps & DispatchProps & OwnProps;

let unlisten;

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      eventId: undefined,
    };
  }

  componentDidMount() {
    unlisten = history.listen((location, action) => {
      if (this.state.hasError) {
        this.setState({ hasError: false });
      }
    });
  }

  componentWillUnmount() {
    unlisten();
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
      scope.setTag("env", `${process.env.APP_NAME}`);
      scope.setExtras(errorInfo);
      const eventId = Sentry.captureException(error);
      this.setState({eventId: eventId});
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      Sentry.showReportDialog({ eventId: this.state.eventId });
      return <UnauthorizedPage />;
    }

    return this.props.children; 
  }
}

export default withRouter(ErrorBoundary);
