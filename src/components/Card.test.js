import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card Component Test Suite', () => {
	const mockRobotPros = {
		id: 1,
		name: 'Monster Mind',
		email: 'monster.mind@gmail.com'
	};

	// Test1: Snapshot Testing
	test('Matches snapshot with Robot Data', () => {
		const { container } = render(<Card {...mockRobotPros} />);
		// debug(); 
		// console.log(container.innerHTML);
		expect(container.firstChild).toMatchSnapshot();
	});

	// Test 2: Renders Robot's information correctly
	test('Renders Robot name and email correctly', () => {
		render(<Card {...mockRobotPros} />);

		expect(screen.getByText('Monster Mind')).toBeInTheDocument();
		expect(screen.getByText('monster.mind@gmail.com')).toBeInTheDocument();
	});

	// Test 3: Image URL is constructed correctly
	test('Constructs correct image ULR', () => {
		render(<Card {...mockRobotPros} />);

		const imageElement = screen.getByAltText('robot');
		expect(imageElement.src).toBe(`https://robohash.org/${mockRobotPros.id}?size=200x200`);
	});

	// Test 4: Renders different robot data correctly
	test('Renders different robot data correctly', () => {
		const otherRobotPros = {
			id: 2,
			name: 'Dragon Mind',
			email: 'dragon.mind@gmail.com'
		}

		render(<Card {...otherRobotPros} />);

		expect(screen.getByText('Dragon Mind')).toBeInTheDocument();
		expect(screen.getByText('dragon.mind@gmail.com')).toBeInTheDocument();

		const imageElement = screen.getByAltText('robot');
		expect(imageElement.src).toBe(`https://robohash.org/2?size=200x200`);
	});
});

