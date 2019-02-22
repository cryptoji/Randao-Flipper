import {
  SET_WEB3,
  SET_CONTRACT,
  SET_ACCOUNTS,
  SET_BALANCE
} from '../actions/blockchain';

const initialState = {
  web3: null,
  contract: null,
  accounts: [],
  balance: 0,
  network: {
    block: {
      number: 0,
      hash: null
    }
  }
};

// App reducer
export const blockchain = (state = initialState, action) => {
  switch (action.type) {
    case SET_WEB3:
      return {
        ...state,
        web3: action.payload
      };
    case SET_CONTRACT:
      return {
        ...state,
        contract: action.payload
      };
    case SET_ACCOUNTS:
      return {
        ...state,
        accounts: [...action.payload]
      };
    case SET_BALANCE:
      return {
        ...state,
        balance: action.payload
      };
    default:
      return state;
  }
}

export default blockchain;