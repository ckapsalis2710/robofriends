import {
  setSearchField,
  requestRobots
} from './actions';

import {
  CHANGE_SEARCH_FIELD,
  REQUEST_ROBOTS_PENDING,
  REQUEST_ROBOTS_SUCCESS,
  REQUEST_ROBOTS_FAILED
} from './constants';


describe('Actions Test Suite', () => {

  describe('setSearchField Action', () => {
    it('should create an action to change search field', () => {
      const text = 'Test text';
      const expectedAction = {
        type: CHANGE_SEARCH_FIELD,
        payload: text
      }

      expect(setSearchField(text)).toEqual(expectedAction);
    });

    it('should handle empty search text', () => {
      const text = '';
      const expectedAction = {
        type: CHANGE_SEARCH_FIELD,
        payload: ''
      }

      expect(setSearchField(text)).toEqual(expectedAction);
    });
  });

  describe('requestRobots Async Action', () => {

    //Mock fetch for all test
    let fetchMock;

    beforeEach(() => {
      fetchMock = jest.fn();
      global.fetch = fetchMock;
   });

    afterEach(() => {
      fetchMock.mockClear();
    });

    it('should handle successful robots API request', async () => {
      const mockRobots = [
        { id: 1, name: 'Robot 1', email: 'robot1@test.com' },
        { id: 2, name: 'Robot 2', email: 'robot2@test.com' }
      ];

      // Mock successful response
      const mockResponse = {
        json: jest.fn().mockResolvedValue(mockRobots)
      };
      fetchMock.mockResolvedValue(mockResponse);

      const dispatch = jest.fn();
      const thunkFunction = requestRobots();
      
      await thunkFunction(dispatch);

      expect(dispatch).toHaveBeenCalledTimes(2);
      // Ignore first Redux @@INIT action 
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: REQUEST_ROBOTS_PENDING
      });
      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: REQUEST_ROBOTS_SUCCESS,
        payload: mockRobots
      });
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users');
    });

    it('should dispatch FAILED action on API error', async () => {
      const mockError = new Error('API is down');

      // Mock failed API response
      fetchMock.mockRejectedValue(mockError);

      const dispatch = jest.fn();
      const thunkFunction = requestRobots();
      
      await thunkFunction(dispatch);
      
      expect(dispatch).toHaveBeenCalledTimes(2);
      // Ignore first Redux @@INIT action 
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: REQUEST_ROBOTS_PENDING
      });
      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: REQUEST_ROBOTS_FAILED,
        payload: mockError
      });
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users');
    });
  });
});

