import {
  UPDATE_FORM_FIELD
} from '../actions/forms';

const initialState = {
  createGame: {
    _isLoading: false,
    _errors: [],
    configId: 0,
    secret: 0,
    deposit: 0,
    ownerInvolved: false
  },
  createConfig: {
    _isLoading: false,
    _errors: [],
    participants: 0,
    winners: 0,
    deadline: 0
  },
  commitNumber: {
    _isLoading: false,
    _errors: [],
    secret: 0
  },
  revealNumber: {
    _isLoading: false,
    _errors: [],
    number: 0
  }
};

export const forms = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_FORM_FIELD:
      return {
        ...state,
        [action.payload.formId]: {
          ...state[action.payload.formId],
          [action.payload.name]: action.payload.value
        }
      };
    default:
      return state;
  }
}

export default forms;