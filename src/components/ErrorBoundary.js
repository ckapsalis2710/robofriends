import React, {Component} from 'react';

class ErrorBoundary extends Component {
	constructor(props){
		super(props);
		this.state = {
			hasError: false
		}
	}

	componentDidCatch(error, info){
		this.setState({ hasError: true });
	}

	componentDidUpdate(prevProps) {
    // if children changed, reset το error state
		if (this.props.children !== prevProps.children) {
		  this.setState({ hasError: false });
		}
	}

	render(){
		if (this.state.hasError) {
			return (
				<div>
		          	<h1>Ooooops. This is not good</h1>
		          		<button onClick={() => this.setState({ hasError: false })}>
		            		Try Again
		          		</button>
		        </div>
			);
		}
		return this.props.children;
	}
}

export default ErrorBoundary;