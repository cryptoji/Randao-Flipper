import {
  FETCH_GAME,
  FETCH_GAME_CONFIG
} from '../actions/games';

// Initial state
const initialState = {
  data: [],
  configs: []
};

// Games reducer
export const games = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GAME:
      return {
        ...state,
        data: state.data
          .filter(g => g.id !== action.payload.id)
          .concat(action.payload)
      };
    case FETCH_GAME_CONFIG:
      return {
        ...state,
        configs: state.configs.concat(action.payload)
      };
    default:
      return state;
  }
}

export default games;