import {
	searchRobots,
	requestRobots
} from './reducers';

import {
	CHANGE_SEARCH_FIELD,
	REQUEST_ROBOTS_PENDING,
	REQUEST_ROBOTS_SUCCESS,
	REQUEST_ROBOTS_FAILED
} from './constants';

describe('Reducers Test Suite', () => {
	describe('searchRobots reducer', () => {
		const initialState = {
			searchField: ''
		};

		it('Should return the initial state', () => {
			expect(searchRobots(undefined, {})).toEqual(initialState);
		});

		it('should handle CHANGE_SEARCH_FIELD action', () => {
	      const action = {
	        type: CHANGE_SEARCH_FIELD,
	        payload: 'test search'
	      };
	      
	      const expectedState = {
	        searchField: 'test search'
	      };
	      
	      expect(searchRobots(initialState, action)).toEqual(expectedState);
	    });

	    it('should handle CHANGE_SEARCH_FIELD with empty string', () => {
	      const action = {
	        type: CHANGE_SEARCH_FIELD,
	        payload: ''
	      };
	      
	      const expectedState = {
	        searchField: ''
	      };
	      
	      expect(searchRobots(initialState, action)).toEqual(expectedState);
	    });

	    it('should return current state for unknown action types', () => {
	      const currentState = {
	        searchField: 'current value'
	      };
	      
	      const action = {
	        type: 'UNKNOWN_ACTION'
	      };
	      
	      expect(searchRobots(currentState, action)).toEqual(currentState);
	    });
	});

	describe('requestRobots reducer', () => {
		const initialState = {
			isPending: false,
			robots: [],
			error: ''
		};

		it('should return the initial state', () => {
	      expect(requestRobots(undefined, {})).toEqual(initialState);
	    });

	    it('should handle REQUEST_ROBOTS_PENDING action', () => {
	    	const action = {
	    		type: REQUEST_ROBOTS_PENDING
	    	};

	    	const expectedState = {
	    		isPending: true,
				robots: [],
				error: ''
	    	};

	    	expect(requestRobots(initialState, action)).toEqual(expectedState);
	    });

	    it('should handle REQUEST_ROBOTS_SUCCESS action', () => {
	    	const mockRobots = [
	    		{ id: 3, name: 'Robot 3', email: 'robot3@test.com' },
        		{ id: 8, name: 'Robot 4', email: 'robot4@test.com' }
	    	];

	    	const action = {
	    		type: REQUEST_ROBOTS_SUCCESS,
	    		payload: mockRobots
	    	};

	    	const expectedState = {
	    		isPending: false,
				robots: mockRobots,
				error: ''
	    	};

	    	expect(requestRobots(initialState, action)).toEqual(expectedState);
	    });

	    it('should handle REQUEST_ROBOTS_SUCCESS and reset error', () => {
	      const currentState = {
	        isPending: true,
	        robots: [],
	        error: 'Previous error'
	      };

	      const mockRobots = [
	        { id: 1, name: 'Robot 1', email: 'robot1@test.com'  }
	      ];

	      const action = {
	        type: REQUEST_ROBOTS_SUCCESS,
	        payload: mockRobots
	      };
	      
	      const expectedState = {
	        isPending: false,
	        robots: mockRobots,
	        error: ''
	      };
	      
	      expect(requestRobots(currentState, action)).toEqual(expectedState);
	    });

	    it('should handle REQUEST_ROBOTS_FAILED action', () => {
	      const mockError = 'API Error Message';

	      const action = {
	        type: REQUEST_ROBOTS_FAILED,
	        payload: mockError
	      };
	      
	      const expectedState = {
	        isPending: false,
	        robots: [],
	        error: mockError
	      };
	      
	      expect(requestRobots(initialState, action)).toEqual(expectedState);
	    });

	    it('should handle REQUEST_ROBOTS_FAILED and clear robots', () => {
	      const currentState = {
	        isPending: true,
	        robots: [{ id: 1, name: 'Current Robot', email: 'currentRobot@test.com' }],
	        error: ''
	      };

	      const mockError = 'Network Error';

	      const action = {
	        type: REQUEST_ROBOTS_FAILED,
	        payload: mockError
	      };
	      
	      const expectedState = {
	        isPending: false,
	        robots: [{ id: 1, name: 'Current Robot', email: 'currentRobot@test.com' }], // 🔧 Προσοχή: τα robots παραμένουν!
	        error: mockError
	      };
	      
	      expect(requestRobots(currentState, action)).toEqual(expectedState);
	    });

	    it('should handle REQUEST_ROBOTS_SUCCESS with empty robots array', () => {
	      const action = {
	        type: REQUEST_ROBOTS_SUCCESS,
	        payload: []
	      };
	      
	      const expectedState = {
	        isPending: false,
	        robots: [],
	        error: ''
	      };
	      
	      expect(requestRobots(initialState, action)).toEqual(expectedState);
	    });
	});
});