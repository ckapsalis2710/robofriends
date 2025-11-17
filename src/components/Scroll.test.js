import React from 'react';
import { render, screen } from '@testing-library/react';
import Scroll from './Scroll';

describe('Scroll Component Test Suite', () => {

	// Test 1: Applies correct inline styles
  test('Has correct scroll styling', () => {
    const { container } = render(
      <Scroll>
        <div>Content</div>
      </Scroll>
    );

    const scrollDiv = container.firstChild;
    
    expect(scrollDiv).toHaveStyle({
      overflowY: 'scroll',
      border: '1px solid white',
      height: '800px'
    });
  });

  // Test 2: Snapshot testing
  test('Matches snapshot with children', () => {
    const { container } = render(
      <Scroll>
        <div>Test content</div>
      </Scroll>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

});