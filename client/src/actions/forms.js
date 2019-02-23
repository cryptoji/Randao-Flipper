import { toggleModal } from './modals';
import { fetchBalance } from './blockchain';

// Action types
export const CREATE_GAME_FORM_UPDATE = 'CREATE_GAME_FORM_UPDATE';
export const CREATE_GAME_OWNER_INVOLVED_UPDATE = 'CREATE_GAME_OWNER_INVOLVED_UPDATE';
export const CREATE_CONFIG_FORM_UPDATE = 'CREATE_CONFIG_FORM_UPDATE';

export const updateCreateGameForm = (payload) => ({
  type: CREATE_GAME_FORM_UPDATE,
  payload
});

export const updateCreateConfigForm = (payload) => ({
  type: CREATE_CONFIG_FORM_UPDATE,
  payload
});

export const updateOwnerInvolved = () => ({
  type: CREATE_GAME_OWNER_INVOLVED_UPDATE
});

/*
 * Create config actions
 */
export const handleConfigFieldChange = (event) => {
  return (dispatch) => {
    let { value, name, type } = event.target;
    if (type === 'number') { value = parseInt(value); }
    dispatch(updateCreateConfigForm({ field: name, value, type }));
  };
};

export const handleCreateConfig = (event) => {
  event.preventDefault();

  return async(dispatch, state) => {
    const { account, contract } = state().blockchain;
    const { participants, winners, deadline } = state().forms.createConfig;

    try {
      await contract.methods
        .createConfiguration(participants, winners, deadline)
        .send({ from: account });
    } catch (e) {
      console.error(e);
    }

    dispatch(toggleModal('createConfig'));
    await dispatch(fetchBalance());
  };
};

/*
 * Create game actions
 */
export const handleGameFieldChange = (event) => {
  return (dispatch) => {
    let { value, name, type } = event.target;
    if (type === 'number') { value = parseInt(value); }
    dispatch(updateCreateGameForm({ field: name, value, type }));
  };
};

export const handleCreateGame = (event) => {
  event.preventDefault();

  return async(dispatch, state) => {
    const { web3, account, contract } = state().blockchain;
    let { configId, secret, deposit, ownerInvolved } = state().forms.createGame;

    secret = await contract.methods.encode(secret, account).call();
    deposit = web3.utils.toHex(web3.utils.toWei(web3.utils.toBN(deposit), 'ether'));

    try {
      await contract.methods
        .createGame(configId, secret, deposit, ownerInvolved)
        .send({
          from: account,
          // value: deposit
        });
    } catch (e) {
      console.error(e);
    }

    dispatch(toggleModal('createGame'));
    await dispatch(fetchBalance());
  };
};