import {
  CREATE_GAME_FORM_UPDATE,
  CREATE_GAME_OWNER_INVOLVED_UPDATE,
  CREATE_CONFIG_FORM_UPDATE
} from '../actions/forms';

const initialState = {
  createGame: {
    _errors: [],
    configId: 0,
    secret: 0,
    deposit: 0,
    ownerInvolved: false
  },
  createConfig: {
    _errors: [],
    participants: 0,
    winners: 0,
    deadline: 0
  }
};

export const forms = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_GAME_FORM_UPDATE:
      return {
        ...state,
        createGame: {
          ...state.createGame,
          [action.payload.field]: action.payload.value
        }
      };
    case CREATE_GAME_OWNER_INVOLVED_UPDATE:
      return {
        ...state,
        createGame: {
          ...state.createGame,
          ownerInvolved: !state.createGame.ownerInvolved
        }
      };
    case CREATE_CONFIG_FORM_UPDATE:
      return {
        ...state,
        createConfig: {
          ...state.createConfig,
          [action.payload.field]: action.payload.value
        }
      };
    default:
      return state;
  }
}

export default forms;