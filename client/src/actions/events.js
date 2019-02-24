import { loadGame, loadConfigs } from './games';

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

export const handleGameCreated = (event, updateLists) => {
  return async(dispatch) => {
    if (updateLists) {
      await dispatch(loadGame(event.data.id));
    }

    await dispatch(fetchGameCreatedEvent(event));
  };
};

export const handleConfigCreated = (event, updateLists) => {
  return async(dispatch) => {
    if (updateLists) {
      await dispatch(loadConfigs());
    }

    await dispatch(fetchConfigCreatedEvent(event));
  };
};

export const handleNumberCommited = (event, updateLists) => {
  return async(dispatch) => {
    if (updateLists) {
      await dispatch(loadGame(event.data.gameId));
    }

    await dispatch(fetchConfigCreatedEvent(event));
  };
};

export const handleNumberRevealed = (event, updateLists) => {
  return async(dispatch) => {
    if (updateLists) {
      await dispatch(loadGame(event.data.gameId));
    }

    await dispatch(fetchConfigCreatedEvent(event));
  };
};

export const handleGameCompleted = (event, updateLists) => {
  return async(dispatch) => {
    if (updateLists) {
      await dispatch(loadGame(event.data.gameId));
    }

    await dispatch(fetchConfigCreatedEvent(event));
  };
};

export const handleRewardSent = (event) => {
  return async(dispatch) => {
    await dispatch(fetchConfigCreatedEvent(event));
  };
};



export const handleEvent = (_event, updateLists = false) => {
  return async(dispatch) => {
    const type = _event.event;
    const data = _event.returnValues;
    const id = _event.id;
    const event = { id, type, data };

    switch (type) {
      case 'GameConfigurationCreated':
        dispatch(handleConfigCreated(event, updateLists));
        break;
      case 'GameCreated':
        dispatch(handleGameCreated(event, updateLists));
        break;
      case 'NumberCommited':
        dispatch(handleNumberCommited(event, updateLists));
        break;
      case 'NumberRevealed':
        dispatch(handleNumberRevealed(event, updateLists));
        break;
      case 'GameCompleted':
        dispatch(handleGameCompleted(event, updateLists));
        break;
      case 'RewardSent':
        dispatch(handleRewardSent(event));
        break;
      default:
        return;
    }
  };
};