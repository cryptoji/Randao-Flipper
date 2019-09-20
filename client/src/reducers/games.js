import {
  FETCH_GAME,
  FETCH_GAME_CONFIG,
  SET_OWNER_REWARD,
  SET_TOTAL_WINNERS,
  SET_TOTAL_FUND,
  TOGGLE_GAMES_LOADING
} from '../actions/games';

// Initial state
const initialState = {
  gamesIsLoading: true,
  data: [], // all games list
  configs: [], // games configs,
  ownerReward: '0',
  totalWinners: '0',
  totalFund: '0'
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
    case SET_OWNER_REWARD:
      return {
        ...state,
        ownerReward: action.payload
      };
    case SET_TOTAL_WINNERS:
      return {
        ...state,
        totalWinners: action.payload
      };
    case SET_TOTAL_FUND:
      return {
        ...state,
        totalFund: action.payload
      };
    case TOGGLE_GAMES_LOADING:
      return {
        ...state,
        gamesIsLoading: !state.gamesIsLoading
      }
    default:
      return state;
  }
};

export default games;
