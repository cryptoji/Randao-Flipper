// Action types
export const FETCH_GAME = 'FETCH_GAME';
export const FETCH_GAME_CONFIG = 'FETCH_GAME_CONFIG';


export const fetchGame = (payload) => ({
  type: FETCH_GAME,
  payload
});

export const fetchGameConfig = (payload) => ({
  type: FETCH_GAME_CONFIG,
  payload
});
