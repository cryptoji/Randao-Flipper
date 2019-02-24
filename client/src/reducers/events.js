import {
  FETCH_GAME_CREATED_EVENT,
  FETCH_CONFIG_CREATED_EVENT
} from '../actions/events';

const initialState = {
  data: []
};

export const events = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GAME_CREATED_EVENT:
      return {
        ...state,
        data: state.data.concat(action.payload)
      };
    case FETCH_CONFIG_CREATED_EVENT:
      return {
        ...state,
        data: state.data.concat(action.payload)
      };
    default:
      return state;
  }
}

export default events;