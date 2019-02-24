import {
  SET_WEB3,
  SET_CONTRACT,
  SET_ACCOUNTS,
  SET_BALANCE,
  SET_OWNER,
  SET_IS_OWNER,
  SET_BLOCK_NUMBER
} from '../actions/blockchain';

const initialState = {
  web3: null,
  contract: null,
  accounts: [],
  balance: 0,
  owner: null,
  isOwner: false, // true if current account is owner
  network: {
    blockNumber: 0
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
    case SET_OWNER:
      return {
        ...state,
        owner: action.payload
      };
    case SET_IS_OWNER:
      return {
        ...state,
        isOwner: true
      };
    case SET_BLOCK_NUMBER:
      return {
        ...state,
        network: {
          ...state.network,
          blockNumber: action.payload
        }
      };
    default:
      return state;
  }
}

export default blockchain;