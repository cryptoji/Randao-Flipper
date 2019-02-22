export const FETCH_GAME_CREATED_EVENT = 'FETCH_GAME_CREATED_EVENT';
export const FETCH_CONFIG_CREATED_EVENT = 'FETCH_CONFIG_CREATED_EVENT';

export const fetchGameCreatedEvent = (payload) => ({
  type: FETCH_GAME_CREATED_EVENT,
  payload
});

export const fetchConfigCreatedEvent = (payload) => ({
  type: FETCH_CONFIG_CREATED_EVENT,
  payload
});
