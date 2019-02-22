import {
  FETCH_GAME_CREATED_EVENT,
  FETCH_CONFIG_CREATED_EVENT
} from '../actions/events';

const initialState = {
  games: [],
  configs: [],
  commits: [],
  reveals: [],
  rewards: [],
  closures: [] // gameClosed events
};

export const events = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GAME_CREATED_EVENT:
      return {
        ...state,
        games: state.games.concat(action.payload)
      };
    case FETCH_CONFIG_CREATED_EVENT:
      return {
        ...state,
        configs: state.configs.concat(action.payload)
      };
    default:
      return state;
  }
}

export default events;