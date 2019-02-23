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

export const handleGameCreated = (event, updateLists = false) => {
  return (dispatch) => {
    // console.log(event)
    dispatch(
      fetchGameCreatedEvent(event)
    );

    if (updateLists) {
      dispatch(loadGame(event.data.id));
    }
  };
};

export const handleConfigCreated = (event, updateLists = false) => {
  return (dispatch) => {
    // console.log(event);
    dispatch(
      fetchConfigCreatedEvent(event)
    );

    if (updateLists) {
      dispatch(loadConfigs());
    }
  };
};

export const handleEvent = (_event, updateLists = false) => {
  return async(dispatch, state) => {
    const { configs } = state().games;

    const type = _event.event;
    const data = _event.returnValues;
    const id = _event.id;
    const event = {id, type, data};

    switch (type) {
      case 'GameConfigurationCreated':
        const config = configs.find(c => c.id + '' === data.id);
        dispatch(
          handleConfigCreated({...event, config}, updateLists)
        );
        break;
      case 'GameCreated':
        dispatch(
          handleGameCreated(event, updateLists)
        );
        break;
      default:
        return;
    }
  };
};