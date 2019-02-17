import React, { Component } from 'react';
import getWeb3 from './utils/getWeb3';
import EtherFlipper from './contracts/EtherFlipper.json';

class Flipper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      accounts: null,
      contract: null,

      // Forms
      configurationForm: {
        participants: 0,
        winners: 0
      },

      createGameForm: {
        configId: 0,
        deposit: 0,
        secret: 0
      },

      joinGameForm: {
        secret: 0
      },

      confirmNumberValue: 0,

      // Block chain info
      networkInfo: {
        height: 0
      },

      // Game data
      configurations: [],
      games: []
    }
  }

  async componentDidMount() {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = EtherFlipper.networks[networkId];
      const contract = new web3.eth.Contract(
        EtherFlipper.abi,
        deployedNetwork && deployedNetwork.address
      );

      // await contract.methods.newCampaign(540, web3.utils.toHex(1*10**18), 50, 30).send({
      //   from: accounts[0],
      //   value: 1000000000000000000
      // });

      this.setState({ web3, accounts, contract });

      const data = await contract.methods.encode(1, '0x08469152a0C585247F1bBCEAcaee710549AdBB37').call();
      console.log(data);

      // Initial data
      this.loadNetworkInfo();
      this.subscribeNewBlocks();
      this.subscribeContractEvents();

      await this.loadConfigurations();
      await this.loadGames();

      // this.addConfiguration();
    } catch (e) {
      console.error(e);
    }
  }

  subscribeNewBlocks() {
    const { web3 } = this.state;
    web3.eth
      .subscribe('newBlockHeaders', (error, result) => {
        if (!error) {
          console.log(result);
          return;
        }
        console.error(error);
      })
      .on('data', blockHeader => {
        this.setState(prevState => {
          return {
            networkInfo: {
              ...prevState.networkInfo,
              height: blockHeader.number
            }
          }
        })
      })
      .on('error', console.error);
  }

  subscribeContractEvents() {
    const { contract } = this.state;
    contract.events.GameCreated((error, event) => {
      console.log(error, event);
    });
  }

  loadNetworkInfo = async() => {
    const { web3 } = this.state;
    const currentHeight = await web3.eth.getBlockNumber();

    this.setState(prevState => {
      return {
        networkInfo: {
          ...prevState.networkInfo,
          height: currentHeight
        }
      }
    });
  }

  loadConfigurations = async() => {
    const { contract } = this.state;
    const configurations = [];

    try {
      const configurationsNumber =
        await contract.methods.ConfigurationsCounter().call();

      for(let i = 0; i < configurationsNumber; i++) {
        const data = await contract.methods.GameConfigurations(i).call();
        configurations.push({
          id: i,
          label: `${data.winnersNumber} winners from ${data.participantsNumber} players`,
          data
        });
      }
    } catch (e) {
      console.error(e);
    }

    this.setState({ configurations });
  }

  loadGames = async() => {
    const { contract } = this.state;
    const games = [];

    try {
      const compaignsNumber = await contract.methods.GameCounter().call();
      for(let i = 0; i < compaignsNumber; i++) {
        const data = await contract.methods.getGame(i).call();
        games.push(data);
      }
    } catch (e) {
      console.error(e);
    }

    this.setState({ games });
  }

  addConfiguration = async(e) => {
    e.preventDefault();

    const { accounts, contract } = this.state;
    const { participants, winners } = this.state.configurationForm;

    await contract.methods
      .createConfiguration(participants, winners)
      .send({ from: accounts[0] });

    this.loadConfigurations();
  }

  createGame = async(e) => {
    e.preventDefault();

    const { web3, accounts, contract } = this.state;
    const { configId, secret, deposit } = this.state.createGameForm;

    const hashedSecret = await contract.methods.encodeString(secret).call();

    await contract.methods
      .createGame(configId, hashedSecret)
      .send({
        from: accounts[0],
        value: web3.utils.toWei(web3.utils.toBN(deposit), 'ether')
      });

    this.loadGames();
  }

  joinGame = async(e, game) => {
    e.preventDefault();

    const { accounts, contract } = this.state;
    const secret = this.state.joinGameForm.secret;
    const hashedSecret = await contract.methods.encodeString(secret).call();

    await contract.methods
      .joinGame(game.id, hashedSecret)
      .send({
        from: accounts[0],
        value: game.deposit
      });

    this.loadGames();
  }

  confirmNumber = async(e, gameId) => {
    e.preventDefault();

    const { accounts, contract, confirmNumberValue } = this.state;

    await contract.methods
      .confirmNumber(gameId, confirmNumberValue)
      .send({ from: accounts[0] });

    this.loadGames();
  }


  // Events
  handleSelectConfiguration = (event) => {
    const configId = event.target.value;
    this.setState(prevState => {
      return {
        createGameForm: {
          ...prevState.createGameForm,
          configId: parseInt(configId)
        }
      };
    });
  }

  handleSecretChange = (event) => {
    const { value, name, type } = event.target;
    this.setState(prevState => {
      return {
        createGameForm: {
          ...prevState.createGameForm,
          [name]: type === 'number' ? parseFloat(value) : value
        }
      };
    });
  }

  handleJoinGameChange = (event) => {
    const { value, name, type } = event.target;
    this.setState(prevState => {
      return {
        joinGameForm: {
          ...prevState.joinGameForm,
          [name]: type === 'number' ? parseFloat(value) : value
        }
      };
    });
  }

  handleAddConfigChange = (event) => {
    const { value, name, type } = event.target;
    this.setState(prevState => {
      return {
        configurationForm: {
          ...prevState.configurationForm,
          [name]: type === 'number' ? parseFloat(value) : value
        }
      };
    });
  }

  render() {
    return (
      <main>
        <header>
          <h1>Ether Flipper</h1>
          <h3>Current height: {JSON.stringify(this.state.networkInfo.height)}</h3>
        </header>
        <hr/>
        <section>
          <h3>Create game</h3>
          <form onSubmit={this.createGame}>
            <div>
              <label>Configuration</label>
              <select
                value={this.state.createGameForm.configId}
                onChange={this.handleSelectConfiguration}>
                {
                  this.state.configurations.map((config, index) => {
                    return (
                      <option
                        key={index}
                        value={config.id}>
                        {config.label}
                      </option>
                    );
                  })
                }
              </select>
            </div>
            <div>
              <label>Secret number</label>
              <input
                type="number"
                name="secret"
                value={this.state.createGameForm.secret}
                onChange={this.handleSecretChange}/>
            </div>
            <div>
              <label>Deposit</label>
              <input
                type="number"
                name="deposit"
                value={this.state.createGameForm.deposit}
                onChange={this.handleSecretChange}/>
            </div>
            <input type="submit" value="Create"/>
          </form>
        </section>
        <hr/>
        <section>
          <h3>Add configuration</h3>
          <form onSubmit={this.addConfiguration}>
            <div>
              <label>Participants</label>
              <input
                type="number"
                name="participants"
                value={this.state.configurationForm.participants}
                onChange={this.handleAddConfigChange}/>
            </div>
            <div>
              <label>Winners</label>
              <input
                type="number"
                name="winners"
                value={this.state.configurationForm.winners}
                onChange={this.handleAddConfigChange}/>
            </div>
            <input type="submit" value="Add"/>
          </form>
        </section>
        <hr/>
        <section>
          <h2>Games</h2>
          <div>
            {
              this.state.games.map((game, index) => {
                const gameConfig = this.state.configurations[game.configId];
                return (
                  <div key={index}>
                    <header>
                      <h2>#{game.id}</h2>

                      <div>
                        <button>Remove</button>
                      </div>
                    </header>

                    <h5>
                      Deposit:
                      {
                        this.state.web3.utils.fromWei(
                          this.state.web3.utils.toBN(game.deposit),
                          'ether'
                        )
                      } ETH
                    </h5>
                    <h5>
                      Participants: {game.participants.length}/{gameConfig.data.participantsNumber}
                    </h5>
                    <ul>
                      {
                        game.participants.map((participant, index) => {
                          return <li key={index}>{participant}</li>;
                        })
                      }
                    </ul>

                    <h5>
                      Winners: {game.winners.length}/{gameConfig.data.winnersNumber}</h5>
                    <ul>
                      {
                        game.winners.map((winner, index) => {
                          return <li key={index}>{winner}</li>;
                        })
                      }
                    </ul>

                    <div>
                      <h5>Join to game</h5>
                      <form onSubmit={(event) => this.joinGame(event, game)}>
                        <input
                          type="number"
                          name="secret"
                          value={this.state.joinGameForm.secret}
                          onChange={this.handleJoinGameChange}/>
                        <input type="submit" value="Join"/>
                      </form>
                    </div>

                    <div>
                      <h5>Confirm secret</h5>
                      <form onSubmit={(event) => this.confirmNumber(event, game.id)}>
                        <input
                          type="number"
                          name="secret"
                          value={this.state.confirmNumberValue}
                          onChange={
                            (event) => this.setState({ confirmNumberValue: event.target.value })
                          }/>
                        <input type="submit" value="Confirm"/>
                      </form>
                    </div>

                    {JSON.stringify(game)}

                  </div>
                );
              })
            }
          </div>
        </section>
      </main>
    );
  }
}

export default Flipper;