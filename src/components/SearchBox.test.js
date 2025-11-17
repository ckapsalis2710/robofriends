import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBox from './SearchBox';

describe('SearchBox Component Test Suite', () => {
	const mockSearchChange = jest.fn();

	beforeEach(() => {
		mockSearchChange.mockClear(); // Clear function before executing next Test case
	});

	// Test 1: Snapshot Testing
	test('Matches snapshot', () => {
		const {container} = render(<SearchBox searchChange={mockSearchChange} />);

		expect(container.firstChild).toMatchSnapshot();
	});

	// Test 2: Calls searchChange on input change
	test('Calls searchChange on user input', async () => {
		render(<SearchBox searchChange={mockSearchChange} />);

		const searchInput = screen.getByPlaceholderText('search robots');

		// User types in the search box
		await userEvent.type(searchInput, 'monster');

		// searchChange should be called for each character
		expect(mockSearchChange).toHaveBeenCalledTimes(7);

		const lastCall = mockSearchChange.mock.calls[6][0];
		expect(lastCall.target.value).toBe('monster');

		// Change to empty string (e.g., user deletes text)
		await userEvent.clear(searchInput);

		expect(mockSearchChange).toHaveBeenCalledTimes(8);
		expect(mockSearchChange.mock.calls[0][0].target.value).toBe('');
	})

});