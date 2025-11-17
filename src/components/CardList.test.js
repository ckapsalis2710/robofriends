import React from 'react';
import { render, screen } from '@testing-library/react';
import CardList from './CardList';

const mockRobots = [
  { id: 5, name: 'Monster Mind', email: 'monster.mind@gmail.com' },
  { id: 8, name: 'Dragon Mind', email: 'dragon.mind@gmail.com' },
  { id: 9, name: 'Robot Master', email: 'robot.master@gmail.com' }
];

describe('CardList Test Suite', () => {

	// Test 1: Snapshot testing
	test('Matches Snapshot with Robots array', () => {
		const { container } = render(<CardList robots={mockRobots} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	// Test 2: Renders correct number of Card components
	test('Renders correct number of Robot cards', () => {
		render(<CardList robots={mockRobots} />);

		expect(screen.getAllByTestId('robot-card')).toHaveLength(mockRobots.length);
	});

	// Test 3: Renders all Robots info correctly
	test('Renders all Robots info correctly', () => {
		render(<CardList robots={mockRobots} />);

		mockRobots.forEach(robot => {
			expect(screen.getByText(robot.name)).toBeInTheDocument();
			expect(screen.getByText(robot.email)).toBeInTheDocument();
		})
	});

	// Test 4: Handles empty robots array search
	test('Show no result on empty search', () => {
		render(<CardList robots={[]} />);

		// Should not render any robot cards
		const RobotCards = screen.queryAllByTestId('robot-card');
		expect(RobotCards).toHaveLength(0);

		// Div container must exists even though
		const CardListContainer = screen.getByTestId('card-list-container');
		expect(CardListContainer).toBeInTheDocument();
		expect(CardListContainer).toBeEmptyDOMElement();
	});

	// Test 5: Passes correct prop info to image src
	test('Passes correct prop info to image src', () => {
		render(<CardList robots={mockRobots} />);

		const images = screen.getAllByAltText('robot');
		images.forEach((robotImg, index) => {
			expect(robotImg.src).toBe(`https://robohash.org/${mockRobots[index].id}?size=200x200`);
		})
	});

});