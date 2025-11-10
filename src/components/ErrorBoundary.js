import React from 'react';

/**
 * ErrorBoundary Component
 * Catches JavaScript errors anywhere in the child component tree and displays a fallback UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    // Reset error state to retry rendering
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
      return (
        <div className="error-boundary">
          <div className="error-boundary__container">
            <h1 className="error-boundary__title">Something went wrong</h1>
            <p className="error-boundary__message">
              The application encountered an unexpected error. Please try refreshing the page.
            </p>
            
            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-boundary__details">
                <summary>Error Details (Development Mode)</summary>
                <pre className="error-boundary__stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            
            <div className="error-boundary__actions">
              <button 
                onClick={this.handleRetry}
                className="error-boundary__button error-boundary__button--retry"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="error-boundary__button error-boundary__button--refresh"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Render children normally when no error
    return this.props.children;
  }
}

export default ErrorBoundary;