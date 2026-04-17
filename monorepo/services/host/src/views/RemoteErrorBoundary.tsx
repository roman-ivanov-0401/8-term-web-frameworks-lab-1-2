import { Component, type ErrorInfo, type ReactNode } from 'react';
import RemoteUnavailable from './RemoteUnavailable';

type RemoteErrorBoundaryProps = {
	serviceName: string;
	children: ReactNode;
};

type RemoteErrorBoundaryState = {
	hasError: boolean;
};

class RemoteErrorBoundary extends Component<RemoteErrorBoundaryProps, RemoteErrorBoundaryState> {
	state: RemoteErrorBoundaryState = {
		hasError: false,
	};

	static getDerivedStateFromError(): RemoteErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Failed to load remote microfrontend', {
			serviceName: this.props.serviceName,
			error,
			errorInfo,
		});
	}

	handleRetry = () => {
		window.location.reload();
	};

	render() {
		if (this.state.hasError) {
			return (
				<RemoteUnavailable
					serviceName={this.props.serviceName}
					onRetry={this.handleRetry}
				/>
			);
		}

		return this.props.children;
	}
}

export default RemoteErrorBoundary;
