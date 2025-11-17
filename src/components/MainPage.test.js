import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MainPage from './MainPage';

// Mock child components
jest.mock('../components/CardList', () => {
	return function MockCardList({ robots }) {
		return (
			<div data-testid="card-list">
		        {robots.map(robot => (
	          		<div key={robot.id}>
						<h2>{robot.name}</h2>
						<p>{robot.email}</p>
					</div>
		        ))}
	      	</div>
		);
	}
});

jest.mock('../components/SearchBox', () => {
  return function MockSearchBox({ searchChange }) {
    return (
      <input 
        data-testid="search-box" 
        onChange={searchChange}
        placeholder="search robots"
      />
    );
  };
});

jest.mock('../components/Scroll', () => {
  return function MockScroll({ children }) {
    return <div data-testid="scroll">{children}</div>;
  };
});

jest.mock('../components/ErrorBoundary', () => {
  return function MockErrorBoundary({ children }) {
    return <div data-testid="error-boundary">{children}</div>;
  };
});

describe('MainPage Component Test Suite', () => {
		const defaultProps = {
	    searchField: '',
	    isPending: false,
	    robots: [],
	    error: '',
	    onSearchChange: jest.fn(),
	    onRequestRobots: jest.fn()
	};

	const mockRobots = [
		{ id: 1, name: 'Robot Man', email: 'robotMan@test.com' },
		{ id: 2, name: 'Robot Tronic', email: 'robotTronic@test.com' },
		{ id: 3, name: 'Master Robot', email: 'masterRobot@test.com' }
	];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should show loading state when isPending=true', () => {
		render(<MainPage {...defaultProps} isPending={true} />);

		expect(screen.getByText('Loading')).toBeInTheDocument();
		expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();
	});

	it('should render main content when not loading and no search filter', () => {
		render(<MainPage {...defaultProps} robots={mockRobots} />);

		expect(screen.getByText('RoboFriends')).toBeInTheDocument();
		expect(screen.getByTestId('search-box')).toBeInTheDocument();
		expect(screen.getByTestId('scroll')).toBeInTheDocument();
		expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
		expect(screen.getByText('Robot Man')).toBeInTheDocument();
		expect(screen.getByText('Robot Tronic')).toBeInTheDocument();
		expect(screen.getByText('masterRobot@test.com')).toBeInTheDocument();
	});

	it('should filter robots based on search field', () => {
	    render(
	      <MainPage 
	        {...defaultProps} 
	        searchField="Ma" 
	        robots={mockRobots} 
	      />
	    );
	    
	    expect(screen.getByText('Robot Man')).toBeInTheDocument();
	    expect(screen.getByText('Master Robot')).toBeInTheDocument();
	    expect(screen.queryByText('Robot Tronic')).not.toBeInTheDocument();
	});

	it('should handle search input changes', () => {
	  	const mockOnSearchChange = jest.fn();
	    render(
	      <MainPage 
	        {...defaultProps} 
	        onSearchChange={mockOnSearchChange}
	        robots={mockRobots} 
	      />
	    );

	    const searchInput = screen.getByTestId('search-box');
	    fireEvent.change(searchInput, {target: {value: 'test'}});

	    expect(mockOnSearchChange).toHaveBeenCalledTimes(1);
 	 });	

	it('should show empty state when no robots', () => {
		render(
			<MainPage 
				{...defaultProps}
				robots={[]}
			/>);

		const cardList = screen.getByTestId('card-list');
		expect(cardList).toBeInTheDocument();
    	expect(cardList).toBeEmptyDOMElement();
	});
});