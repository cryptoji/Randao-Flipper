import {
  FETCH_GAME,
  FETCH_GAME_DATA,
  FETCH_GAME_CONFIG
} from '../actions/games';

// Initial state
const initialState = {
  data: [], // all games list
  configs: [] // games configs
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
        configs: state.configs
          .filter(c => c.id !== action.payload.id)
          .concat(action.payload)
      };
    default:
      return state;
  }
}

export default games;