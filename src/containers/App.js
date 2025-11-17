import React, {Component} from 'react';
import {connect} from 'react-redux';
import MainPage from '../components/MainPage';

import {setSearchField, requestRobots} from '../actions';

const mapStateToProps = state => {
	return {
		searchField: state.searchRobots.searchField,
		isPending: state.requestRobots.isPending,
		robots: state.requestRobots.robots,
		error: state.requestRobots.error
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onSearchChange: (event) => dispatch(setSearchField(event.target.value)),
		onRequestRobots: () => dispatch(requestRobots()) // same as requestRobots(dispatch)
	}
}

class App extends Component {
	componentDidMount() {
		this.props.onRequestRobots();
	}

	render () {
		return <MainPage {...this.props} />
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);