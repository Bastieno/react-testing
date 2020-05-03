import {
  SELECT_SUBREDDIT,
  INVALIDATE_SUBREDDIT,
  REQUEST_POSTS,
  RECEIVE_POSTS
} from '../../actions';
import { selectedSubreddit, postsBySubreddit } from '../index';

describe('appReducer', () => {
  describe('selectedSubreddit', () => {
    it('should return the default state', () => {
      expect(selectedSubreddit(undefined, {})).toBe('reactjs');
    });

    it('should update the selectedSubreddit', () => {
      const subreddit = 'frontend';
      const action = {
        type: SELECT_SUBREDDIT,
        subreddit
      }
      expect(selectedSubreddit(undefined, action)).toBe(subreddit);
    });
  });

  describe('postsBySubreddit', () => {
    it('should return the default state', () => {
      expect(postsBySubreddit(undefined, {})).toEqual({});
    });

    it('should handle INVALIDATE_SUBREDDIT', () => {
      const subreddit = 'frontend';
      const action = {
        type: INVALIDATE_SUBREDDIT,
        subreddit
      }
      expect(postsBySubreddit({}, action)).toEqual({
        [subreddit]: {
          isFetching: false,
          didInvalidate: true,
          items: []
        }
      });
    });

    it('should handle REQUEST_POSTS', () => {
      const subreddit = 'frontend';
      const action = {
        type: REQUEST_POSTS,
        subreddit
      }
      expect(postsBySubreddit({}, action)).toEqual({
        [subreddit]: {
          isFetching: true,
          didInvalidate: false,
          items: []
        }
      });
    });

    it('should handle RECEIVE_POSTS', () => {
      const subreddit = 'frontend';
      const posts = ['post 1', 'post 2']
      const action = {
        type: RECEIVE_POSTS,
        subreddit,
        posts,
        receivedAt: Date.now()
      }
      expect(postsBySubreddit({}, action)).toEqual({
        [subreddit]: {
          isFetching: false,
          didInvalidate: false,
          items: action.posts,
          lastUpdated: action.receivedAt
        }
      });
    });
  });
})
