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

export const handleRewardSent = (event, updateLists) => {
  return async(dispatch) => {
    if (updateLists) {
      await dispatch(loadGame(event.data.gameId));
    }

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
        dispatch(handleRewardSent(event, updateLists));
        break;
      default:
        return;
    }
  };
};

export const subscribeEvents = (getPastEvents = true) => {
  return async(dispatch, state) => {
    const { web3, contract } = state().blockchain;
    try {
      const currentBlock = await web3.eth.getBlockNumber();

      if (getPastEvents) {
        contract.getPastEvents('allEvents', {
          // Events from last 100 blocks
          fromBlock: currentBlock > 100 ? currentBlock - 99 : 0,
          toBlock: 'latest'
        }).then((events) => {
          events.forEach(e => dispatch(handleEvent(e)));
        });
      }

      contract.events.allEvents()
        .on('data', e => dispatch(handleEvent(e, true)))
        .on('changed', console.log)
        .on('error', console.error);
    } catch (e) {
      console.error(e);
    }
  };
};