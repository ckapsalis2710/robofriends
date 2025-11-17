import React from 'react';
import {render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

// Mock CardList that can throw errors
const MockCardList = ({showThrowError = false, robots = []}) => {
	if (showThrowError) {
		throw new Error('CardList crashed!')
	}
	return (
		<div data-testid="card-list">
			{robots.map(robot => (
				<div key={robot.id}>{robot.name}</div>
			))}
		</div>
	);
};

// Suppress console errors for expected error boundaries
beforeAll(() => {
	jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
	console.error.mockRestore();
});


describe('ErrorBoundary Component Test Suite', () => {

	// Test 1: Renders CardList normally when no error occures
	test('Renders CardList normally when no error occures', () => {
		const mockRobots = [
			{id:5, name:'Monster Mind'},
			{id:7, name:'Dragon Mind'},
		];

		render (
	      <ErrorBoundary>
	        <MockCardList robots={mockRobots} />
	      </ErrorBoundary>
	    );

		expect(screen.getByTestId('card-list')).toBeInTheDocument();
		expect(screen.getByText('Monster Mind')).toBeInTheDocument();
		expect(screen.queryByText('Ooooops. This is not good')).not.toBeInTheDocument();
	});
	

	// Test 2: Catches CardList rendering errors
	test('Catches CardList rendering errors', () => {
		render (
	      <ErrorBoundary>
	        <MockCardList showThrowError={true}/>
	      </ErrorBoundary>
	    );

	    expect(screen.getByText('Ooooops. This is not good')).toBeInTheDocument();
	    expect(screen.getByText('Try Again')).toBeInTheDocument();
	    expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();

	});

	// Test 3: Handles CardList with empty robots array
	test('Handles CardList with empty robots array', () => {
		render (
	      <ErrorBoundary>
	        <MockCardList robots={[]}/>
	      </ErrorBoundary>
	    );

	    expect(screen.getByTestId('card-list')).toBeInTheDocument();
	    expect(screen.queryByText('Ooooops. This is not good')).not.toBeInTheDocument();
	})

	// Test 4: ErrorBoundary with auto-recovery
	test('ErrorBoundary recovers when props change', () => {
		const { rerender } = render (
	      <ErrorBoundary>
	        <MockCardList showThrowError={true}/>
	      </ErrorBoundary>
	    );

	    // Should show error initially
	    expect(screen.getByText('Ooooops. This is not good')).toBeInTheDocument();

	    // Re-render with DIFFERENT children (new CardList instance)
		rerender(
			<ErrorBoundary>
			  <MockCardList key="recovered" shouldThrow={false} robots={[{ id: 1, name: 'Recovery Robot' }]} />
			</ErrorBoundary>
		);

		expect(screen.getByText('Recovery Robot')).toBeInTheDocument();
		expect(screen.queryByText('Ooooops. This is not good')).not.toBeInTheDocument();
	});

	// Test 5: ErrorBoundary recovers when Try Again button is clicked
	test('ErrorBoundary recovers when Try Again button is clicked', () => {
		const { rerender } = render (
	      <ErrorBoundary>
	        <MockCardList showThrowError={true}/>
	      </ErrorBoundary>
	    );

	    expect(screen.getByText('Ooooops. This is not good')).toBeInTheDocument();

	    // Try Again button click event
	    fireEvent.click(screen.getByText('Try Again'));

	    // ErrorBoundary reseted but not CardList. Thus, we have to pass new values
	    rerender(
	      <ErrorBoundary>
	        <MockCardList showThrowError={false} robots={[{ id: 2, name: 'After Recovery' }]} />
	      </ErrorBoundary>
	    );

	    expect(screen.getByText('After Recovery')).toBeInTheDocument();
	    expect(screen.queryByText('Ooooops. This is not good')).not.toBeInTheDocument();
	});

	// Test 6: Snapshot tests for both states
	test('Matches snapshot when CardList renders successfully', () => {
		const {asFragment} = render(
	      <ErrorBoundary>
	        <MockCardList robots={[{id: 8, name: 'Test Robot'}]}/>
	      </ErrorBoundary>
	    );

	    expect(asFragment()).toMatchSnapshot();
	});

	test('Matches snapshot when CardList has error', () => {
		const { asFragment } = render(
		  <ErrorBoundary>
		    <MockCardList showThrowError={true} />
		  </ErrorBoundary>
		);

		expect(asFragment()).toMatchSnapshot();
	});

});