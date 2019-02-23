// Action types
export const FETCH_GAME = 'FETCH_GAME';
export const FETCH_GAME_CONFIG = 'FETCH_GAME_CONFIG';


export const fetchGame = (payload) => ({
  type: FETCH_GAME,
  payload
});

export const fetchGameConfig = (payload) => ({
  type: FETCH_GAME_CONFIG,
  payload
});

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
          deposit: web3.utils.fromWei(game.deposit, 'ether')
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