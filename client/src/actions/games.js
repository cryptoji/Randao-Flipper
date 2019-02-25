import { toggleModal } from './modals';
import { fetchBalance } from './blockchain';

// Action types
export const FETCH_GAME = 'FETCH_GAME';
export const FETCH_GAME_CONFIG = 'FETCH_GAME_CONFIG';
export const FETCH_PARTICIPANT_DATA = 'FETCH_PARTICIPANT_DATA';
export const SET_OWNER_REWARD = 'SET_OWNER_REWARD';
export const SET_TOTAL_WINNERS = 'SET_TOTAL_WINNERS';
export const SET_TOTAL_FUND = 'SET_TOTAL_FUND';


export const fetchGame = (payload) => ({
  type: FETCH_GAME,
  payload
});

export const fetchGameConfig = (payload) => ({
  type: FETCH_GAME_CONFIG,
  payload
});

export const fetchParticipantData = (payload) => ({
  type: FETCH_PARTICIPANT_DATA,
  payload
})

export const loadParticipantData = (gameId) => {
  return async(dispatch, state) => {
    const { contract, accounts } = state().blockchain;
    const participantData = await contract.methods.getGameParticipant(
      gameId, accounts[0]
    ).call();
    console.log(participantData);
    dispatch(fetchParticipantData({ gameId, data: participantData }));
  };
};

export const loadGame = (gameId) => {
  return async(dispatch, state) => {
    const { contract, web3 } = state().blockchain;
    const { configs } = state().games;

    try {
      const game = await contract.methods.getGame(gameId).call();
      const config = configs.find((_, i) => i+'' === game.configId);

      dispatch(
        fetchGame({
          ...game,
          config,
          deposit: web3.utils.fromWei(game.deposit, 'ether'),
          _deposit: game.deposit
        })
      );
    } catch (e) {
      console.error(e);
    }
  };
};

export const loadGames = () => {
  return async(dispatch, state) => {
    const { contract } = state().blockchain;
    try {
      const { gamesCount } = await contract.methods.getGamesCount().call();

      for(let i = 0; i < gamesCount; i++) {
        await dispatch(loadGame(i));
      }
    } catch (e) {
      console.error(e);
    }
  };
};

export const loadConfig = (configId) => {
  return async(dispatch, state) => {
    const { contract } = state().blockchain;

    try {
      const config = await contract.methods.GameConfigurations(configId).call();

      dispatch(
        fetchGameConfig({
          ...config,
          id: configId
        })
      );
    } catch (e) {
      console.error(e);
    }
  };
}

export const loadConfigs = () => {
  return async(dispatch, state) => {
    const { contract } = state().blockchain;

    try {
      const { configurationsCount } = await contract.methods.getConfigurationsCount().call();

      for(let i = 0; i < configurationsCount; i++) {
        await dispatch(loadConfig(i));
      }
    } catch (e) {
      console.error(e);
    }
  };
};

/*
 * Create config action
 */
export const handleCreateConfig = () => {
  return async(dispatch, state) => {
    const { accounts, contract } = state().blockchain;
    const { participants, winners, deadline } = state().forms.createConfig;

    try {
      await contract.methods
        .createConfiguration(participants, winners, deadline)
        .send({ from: accounts[0] });

      dispatch(toggleModal('createConfig'));
      await dispatch(fetchBalance());
    } catch (e) {
      console.error(e);
    }
  };
};

/*
 * Create game action
 */
export const handleCreateGame = () => {
  return async(dispatch, state) => {
    const { web3, accounts, contract } = state().blockchain;
    let { configId, secret, deposit, ownerInvolved } = state().forms.createGame;

    secret = await contract.methods.encode(secret, accounts[0]).call();
    deposit = web3.utils.toHex(web3.utils.toWei(deposit.toString(), 'ether'));

    try {
      await contract.methods
        .createGame(configId, secret, deposit, ownerInvolved)
        .send({
          from: accounts[0],
          // value: deposit
        });

      dispatch(toggleModal('createGame'));
      await dispatch(fetchBalance());
    } catch (e) {
      console.error(e);
    }
  };
};

/*
 * Commit number action
 */
export const commitNumber = (game) => {
  return async(dispatch, state) => {
    const { accounts, contract } = state().blockchain;
    const secret = state().forms.commitNumber.secret;
    const hashedSecret = await contract.methods.encode(secret, accounts[0]).call();

    try {
      await contract.methods
        .commitNumber(game.id, hashedSecret)
        .send({
          from: accounts[0],
          value: game._deposit
        });

      await dispatch(loadGame(game.id));
    } catch (e) {
      console.error(e);
    }
  };
};

/*
 * Reveal number action
 */
export const revealNumber = (gameId) => {
  return async(dispatch, state) => {
    const { accounts, contract } = state().blockchain;
    const { number } = state().forms.revealNumber;

    try {
      await contract.methods
        .revealNumber(gameId, number)
        .send({ from: accounts[0] });

      await dispatch(loadGame(gameId));
    } catch (e) {
      console.error(e);
    }
  };
};

/*
 * Complete game action
 */
export const completeGame = (gameId) => {
  return async(dispatch, state) => {
    const { accounts, contract } = state().blockchain;

    try {
      await contract.methods.completeGame(gameId).send({ from: accounts[0] });
      await dispatch(loadGame(gameId));
      await dispatch(fetchContractStatistics());
    } catch (e) {
      console.error(e);
    }
  };
};

/*
 * Games statistics
 */
export const setOwnerReward = payload => ({
  type: SET_OWNER_REWARD,
  payload
});

export const setTotalWinners = payload => ({
  type: SET_TOTAL_WINNERS,
  payload
});

export const setTotalFund = payload => ({
  type: SET_TOTAL_FUND,
  payload
});

export const fetchContractStatistics = () => {
  return async(dispatch, state) => {
    try {
      const { contract } = state().blockchain;
      const ownerReward = await contract.methods.ownerReward().call();
      const totalWinners = await contract.methods.totalWinners().call();
      const totalFund = await contract.methods.totalFund().call();

      dispatch(setOwnerReward(ownerReward));
      dispatch(setTotalWinners(totalWinners));
      dispatch(setTotalFund(totalFund));

    } catch (e) {
      console.error(e);
    }
  };
};

/*
 * Get reward action
 */
export const getReward = (gameId) => {
  return async(dispatch, state) => {
    const { accounts, contract } = state().blockchain;

    try {
      await contract.methods.getReward(gameId).send({ from: accounts[0] });
      await dispatch(fetchBalance());
      await dispatch(fetchContractStatistics());
      alert('You got reward');
    } catch (e) {
      console.error(e);
    }
  }
}