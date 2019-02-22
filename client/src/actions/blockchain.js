// Action types
export const SET_WEB3 = 'SET_WEB3';
export const SET_CONTRACT = 'SET_CONTRACT';
export const SET_ACCOUNTS = 'SET_ACCOUNTS';
export const SET_BALANCE = 'SET_BALANCE';


// Actions
export const setWeb3 = payload => ({
  type: SET_WEB3,
  payload
});

export const setContract = payload => ({
  type: SET_CONTRACT,
  payload
});

export const setAccounts = payload => ({
  type: SET_ACCOUNTS,
  payload
});

export const setBalance = payload => ({
  type: SET_BALANCE,
  payload
})