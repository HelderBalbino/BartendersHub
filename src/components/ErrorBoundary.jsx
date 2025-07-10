import { Component } from 'react';

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null, errorInfo: null };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		this.setState({
			error,
			errorInfo,
		});

		// Log error to monitoring service
		console.error('Error caught by boundary:', error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4'>
					<div className='max-w-md w-full text-center'>
						<div className='text-6xl text-yellow-400 mb-6'>⚠️</div>
						<h1 className='text-2xl text-white font-light tracking-wide uppercase mb-4'>
							Something Went Wrong
						</h1>
						<div className='w-20 h-0.5 bg-yellow-400 mx-auto mb-6'></div>
						<p className='text-gray-400 mb-8'>
							We apologize for the inconvenience. The speakeasy
							has encountered an unexpected issue.
						</p>
						<button
							onClick={() => window.location.reload()}
							className='bg-yellow-400 text-black px-6 py-3 border border-yellow-400 hover:bg-black hover:text-yellow-400 transition-all duration-300 tracking-wide uppercase text-sm'
						>
							Return to the Main Hall
						</button>

						{import.meta.env.DEV && (
							<details className='mt-8 text-left'>
								<summary className='text-yellow-400 cursor-pointer mb-4'>
									Error Details (Development)
								</summary>
								<pre className='text-red-400 text-xs bg-gray-900/50 p-4 rounded border border-red-400/30 overflow-auto'>
									{this.state.error &&
										this.state.error.toString()}
									<br />
									{this.state.errorInfo.componentStack}
								</pre>
							</details>
						)}
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
