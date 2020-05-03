import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { App } from '../App';
import Picker from '../../components/Picker';
import * as actions from '../../actions';


describe('App component', () => {
  it('should render without crashing given the require props', () => {
    const props = {
      isFetching: false,
      dispatch: jest.fn(),
      selectedSubreddit: 'reactjs',
      posts: []
    }
    const wrapper = shallow(<App {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('sets the selectedSubreddit prop as the `value` prop on the Picker Component', () => {
    const props = {
      isFetching: false,
      dispatch: jest.fn(),
      selectedSubreddit: 'reactjs',
      posts: []
    };
    const wrapper = shallow(<App {...props} />);
    // Query for the Picker component in the rendered output
    const PickerComponent = wrapper.find(Picker);
    expect(PickerComponent.props().value).toBe(props.selectedSubreddit)
  });

  it('render the refresh button when the isFetching prop is false', () => {
    const props = {
      isFetching: false,
      dispatch: jest.fn(),
      selectedSubreddit: 'reactjs',
      posts: []
    };
    const wrapper = shallow(<App {...props} />);
    expect(wrapper.find('button').length).toBe(1);
  });

  it('handleRefreshClick dispatches the correct actions', () => {
    const props = {
      isFetching: false,
      dispatch: jest.fn(),
      selectedSubreddit: 'reactjs',
      posts: []
    };
    // Mock event to be passed to the handleRefreshClick function
    const mockEvent = {
      preventDefault: jest.fn()
    }
    // Mock the actions we expect to be called
    actions.invalidateSubreddit = jest.fn();
    actions.fetchPostsIfNeeded = jest.fn();

    const wrapper = shallow(<App {...props} />);
    // The next assertions are for functions called in componentDidMount
    expect(props.dispatch.mock.calls.length).toBe(1);
    expect(actions.fetchPostsIfNeeded.mock.calls.length).toBe(1);

    // Call the function on the component instance, passing the mock event
    wrapper.instance().handleRefreshClick(mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(props.dispatch.mock.calls.length).toBe(3);
    expect(actions.invalidateSubreddit.mock.calls.length).toBe(1);
    expect(actions.fetchPostsIfNeeded.mock.calls.length).toBe(2);
  });

  it('handleChange dispatched the correct actions', () => {
    const props = {
      isFetching: false,
      dispatch: jest.fn(),
      selectedSubreddit: 'reactjs',
      posts: []
    };
    // Mock event to be passed to the handleChange function
    const mockEvent = {
      target: {
        value: 'frontend'
      }
    }

    // Mock actions to be called
    actions.selectSubreddit = jest.fn();
    const wrapper = shallow(<App {...props} />);

    // Call the function on the component instance, passing the mock event
    wrapper.instance().handleChange(mockEvent);
    expect(props.dispatch.mock.calls.length).toBe(2);
    expect(actions.selectSubreddit.mock.calls.length).toBe(1);
    expect(actions.selectSubreddit).toBeCalledWith(mockEvent);
  });

  it('renders a `<h2>Loading...</h2>` if post.length === 0 and the isFetching prop is true', () => {
    const props = {
      isFetching: true,
      dispatch: jest.fn(),
      selectedSubreddit: 'reactjs',
      posts: []
    };
    const wrapper = shallow(<App {...props} />);

    expect(wrapper.find('h2').length).toBe(1);
    expect(wrapper.text()).toContain('Loading...');
  });

  it('renders a `<h2>Empty.</h2>` if post.length === 0 and the isFetching prop is false', () => {
    const props = {
      isFetching: false,
      dispatch: jest.fn(),
      selectedSubreddit: 'reactjs',
      posts: []
    };
    const wrapper = shallow(<App {...props} />);

    expect(wrapper.find('h2').length).toBe(1);
    expect(wrapper.text()).toContain('Empty.');
  });

  it('renders a <span></span> containing the date if lastUpdated prop is provided', () => {
    const props = {
      isFetching: false,
      dispatch: jest.fn(),
      selectedSubreddit: 'reactjs',
      posts: [],
      lastUpdated: 1588527894908
    };

    const wrapper = shallow(<App {...props} />);
    expect(wrapper.find('span').length).toBe(1);
    expect(wrapper.text()).toContain('Last updated at');
  });

  it('call the componentWillReceiveProps lifecycle method when it receives a new selectedSubreddit prop', () => {
    const oldProps = {
      isFetching: false,
      dispatch: jest.fn(),
      selectedSubreddit: 'reactjs',
      posts: [],
    };

    const newProps = {
      isFetching: false,
      dispatch: jest.fn(),
      selectedSubreddit: 'frontend',
      posts: [],
    };

    // Mock the actions to be called
    actions.fetchPostsIfNeeded = jest.fn()

    const wrapper = shallow(<App {...oldProps} />);

    // Call the componentWillReceiveProps lifecycle method on the component instance, passing in the newProps
    wrapper.instance().componentWillReceiveProps(newProps);
    expect(newProps.dispatch.mock.calls.length).toBe(1);
    expect(oldProps.dispatch.mock.calls.length).toBe(1);
    expect(actions.fetchPostsIfNeeded.mock.calls.length).toBe(2);
    // for componentDidMount, fetchPostsIfNeeded('reactjs')
    expect(actions.fetchPostsIfNeeded).toBeCalledWith('reactjs');
    // for componentWillReceiveProps, fetchPostsIfNeeded('frontend')
    expect(actions.fetchPostsIfNeeded).toBeCalledWith('frontend');
  })
})


