import RandaoFlipper from '../contracts/RandaoFlipper.json';
import getWeb3 from '../utils/getWeb3'

// Types
export const SET_WEB3 = 'SET_WEB3';
export const SET_CONTRACT = 'SET_CONTRACT';
export const SET_ACCOUNTS = 'SET_ACCOUNTS';
export const SET_BALANCE = 'SET_BALANCE';
export const SET_OWNER = 'SET_OWNER';
export const SET_IS_OWNER = 'SET_IS_OWNER';
export const SET_BLOCK_NUMBER = 'SET_BLOCK_NUMBER';

/*
 * Web3 actions
 */
export const setWeb3 = payload => ({
  type: SET_WEB3,
  payload
});

export const initWeb3 = () => {
  return async(dispatch) => {
    try {
      const web3 = await getWeb3();
      dispatch(setWeb3(web3));
    } catch (e) {
      console.error(e);
    }
  };
};

/*
 * Contract actions
 */
export const setContract = payload => ({
  type: SET_CONTRACT,
  payload
});

export const initContract = () => {
  return async(dispatch, state) => {
    try {
      const { web3 } = state().blockchain;

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = RandaoFlipper.networks[networkId];
      const contract = new web3.eth.Contract(
        RandaoFlipper.abi,
        deployedNetwork && deployedNetwork.address
      );

      dispatch(setContract(contract));
    } catch (e) {
      console.error(e);
    }
  };
};

/*
 * Accounts actions
 */
export const setAccounts = payload => ({
  type: SET_ACCOUNTS,
  payload
});

export const initAccounts = () => {
  return async(dispatch, state) => {
    try {
      const { web3 } = state().blockchain;
      const accounts = await web3.eth.getAccounts();
      dispatch(setAccounts(accounts));
    } catch (e) {
      console.error(e);
    }
  };
};


/*
 * Balance actions
 */
export const setBalance = payload => ({
  type: SET_BALANCE,
  payload
});

export const fetchBalance = () => {
  return async(dispatch, state) => {
    try {
      const { web3, accounts } = state().blockchain;
      const balance = await web3.eth.getBalance(accounts[0]);

      dispatch(
        setBalance(parseFloat(
          web3.utils.fromWei(balance).substring(0, 7)
        ))
      );
    } catch (e) {
      console.error(e);
    }
  };
};

/*
 * Owner actions
 */
export const setOwner = payload => ({
  type: SET_OWNER,
  payload
});

export const setIsOwner = () => ({
  type: SET_IS_OWNER
});

export const fetchOwner = () => {
  return async(dispatch, state) => {
    try {
      const { contract, accounts } = state().blockchain;
      const owner = await contract.methods.owner().call();

      dispatch(setOwner(owner));

      if (accounts[0] === owner) {
        dispatch(setIsOwner());
      }
    } catch (e) {
      console.error(e);
    }
  };
};

/*
 * Network actions
 */
export const setBlockNumber = payload => ({
  type: SET_BLOCK_NUMBER,
  payload
});

export const fetchNetworkInfo = () => {
  return async(dispatch, state) => {
    const { web3 } = state().blockchain;

    try {
      const blockNumber = await web3.eth.getBlockNumber();
      dispatch(setBlockNumber(blockNumber));
    } catch (e) {
      console.error(e);
    }
  };
};