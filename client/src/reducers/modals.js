import {
  TOGGLE_MODAL
} from '../actions/modals';

const initialState = {
  createGame: {
    _id: 'createGame',
    isOpen: false
  },
  createConfig: {
    _id: 'CreateConfig',
    isOpen: false
  }
};

export const modals = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_MODAL:
      return {
        ...state,
        [action.modalId]: {
          ...state[action.modalId],
          isOpen: !state[action.modalId].isOpen
        }
      };
    default:
      return state;
  }
};


export default modals;