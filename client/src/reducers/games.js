import {
  FETCH_GAME,
  FETCH_GAME_CONFIG,
  FETCH_PARTICIPANT_DATA,
  SET_OWNER_REWARD,
  SET_TOTAL_WINNERS,
  SET_TOTAL_FUND
} from '../actions/games';

// Initial state
const initialState = {
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
    case FETCH_PARTICIPANT_DATA:
      return {
        ...state,
        data: state.data
          .reduce((memo, game) => {
            if (game.id === action.payload.gameId) {
              memo.push({
                ...game,
                _participant: action.payload.data
              });
            } else {
              memo.push(game);
            }
            return memo;
          }, [])
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
    default:
      return state;
  }
};

export default games;