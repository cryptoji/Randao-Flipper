import React, { Component } from 'react';
import getWeb3 from './utils/getWeb3';
import RandaoFlipper from './contracts/RandaoFlipper.json';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      accounts: null,
      contract: null,

      // Forms
      configurationForm: {
        participants: 0,
        winners: 0,
        deadline: 0
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

      // GameCard data
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
      const deployedNetwork = RandaoFlipper.networks[networkId];
      const contract = new web3.eth.Contract(
        RandaoFlipper.abi,
        deployedNetwork && deployedNetwork.address
      );

      // await contract.methods.newCampaign(540, web3.utils.toHex(1*10**18), 50, 30).send({
      //   from: accounts[0],
      //   value: 1000000000000000000
      // });

      this.setState({ web3, accounts, contract });

      const hash = await contract.methods.encode(7, accounts[0]).call();
      console.log(hash)

      const balance = await web3.eth.getBalance(contract.options.address);
      console.log(`Contract balance: ${web3.utils.fromWei(web3.utils.toBN(balance), 'ether')} ETH`);

      // Select winners alg
      let wins = [];
      let wNum = 3;
      let pNum = 10;
      let random = Math.floor(Math.random() * pNum);

      for(let i = 0; i < pNum; i++) {
        wins.push(i);
      }

      console.log('R',random, ';W',wins)

      while(random+wNum/2 > pNum) { random--; }
      while(random-wNum/2+1 < 0) { random++; }

      let takeRight = true;
      let leftBias = random; // left bias
      let rightBias = random;
      for(let i = 0; i < wNum; i++) {
        let bias;
        if(takeRight) {
          bias = rightBias;
          takeRight = false;
          rightBias++;
        } else {
          leftBias--;
          bias = leftBias;
          takeRight = true;
        }
        console.log(wins[bias]);
      }
      // -------------------

      // Initial data
      this.subscribeNewBlocks();
      this.subscribeContractEvents();

      await this.loadNetworkInfo();
      await this.loadConfigurations();
      await this.loadGames();

      // this.addConfiguration();
    } catch (e) {
      console.error(e);
    }
  }

  subscribeNewBlocks() {
    const { web3 } = this.state;

    try {
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
    } catch (e) {
      console.error(e);
    }
  }

  subscribeContractEvents() {
    const { contract } = this.state;

    try {
      contract.events.GameCreated()
        .on('data', (event) => {
          console.log(event)
        })
        .on('changed', (event) => {
          //
        })
        .on('error', console.error);


      contract.events.NumberCommited()
        .on('data', (event) => {
          console.log(event)
        })
        .on('changed', (event) => {
          //
        })
        .on('error', console.error);
    } catch (e) {
      console.error(e);
    }
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
      const { configurationsCount } =
        await contract.methods.getConfigurationsCount().call();

      for(let i = 0; i < configurationsCount; i++) {
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
      const { gamesCount } = await contract.methods.getGamesCount().call();
      for(let i = gamesCount-1; i >= 0; i--) {
        const data = await contract.methods.GameSessions(i).call();
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
    const { participants, winners, deadline } = this.state.configurationForm;

    try {
      await contract.methods
        .createConfiguration(participants, winners, deadline)
        .send({ from: accounts[0] });
    } catch (e) {
      console.error(e);
    }

    this.loadConfigurations();
  }

  createGame = async(e) => {
    e.preventDefault();

    const { web3, accounts, contract } = this.state;
    const { configId, secret, deposit } = this.state.createGameForm;

    const hashedSecret = await contract.methods.encode(secret, accounts[0]).call();

    try {
      await contract.methods
        .createGame(configId, hashedSecret)
        .send({
          from: accounts[0],
          value: web3.utils.toWei(web3.utils.toBN(deposit), 'ether')
        });
    } catch (e) {
      console.error(e);
    }

    this.loadGames();
  }

  commitNumber = async(e, game) => {
    e.preventDefault();

    const { accounts, contract } = this.state;
    const secret = this.state.joinGameForm.secret;
    const hashedSecret = await contract.methods.encode(secret, accounts[0]).call();

    try {
      await contract.methods
        .commitNumber(game.id, hashedSecret)
        .send({
          from: accounts[0],
          value: game.deposit
        });
    } catch (e) {
      console.error(e);
    }

    this.loadGames();
  }

  revealNumber = async(e, gameId) => {
    e.preventDefault();

    const { accounts, contract, confirmNumberValue } = this.state;

    try {
      await contract.methods
        .revealNumber(gameId, confirmNumberValue)
        .send({ from: accounts[0] });
    } catch (e) {
      console.error(e);
    }

    this.loadGames();
  }

  getReward = async(e, gameId) => {
    e.preventDefault();

    const { accounts, contract } = this.state;

    try {
      await contract.methods.getReward(gameId).send({ from: accounts[0] });
    } catch (e) {
      console.error(e);
    }
  }

  completeGame = async(e, gameId) => {
    e.preventDefault();

    const { accounts, contract } = this.state;

    try {
      await contract.methods.completeGame(gameId).send({ from: accounts[0] });
    } catch (e) {
      console.error(e);
    }

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
          <h1>Randao Flipper</h1>
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
            <div>
              <label>Deadline</label>
              <input
                type="number"
                name="deadline"
                value={this.state.configurationForm.deadline}
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
                      <h5>
                        Deadline: {game.deadline}
                      </h5>
                      <h5>
                        Status:
                        {game.completed ? 'Completed' : ''}
                        {game.closed ? 'Closed' : ''}
                        {
                          !game.completed &&
                          !game.closed &&
                          gameConfig.data.participantsNumber > game.participants.length+''
                            ? 'Waiting commits' + ` (${game.commitCounter}/${gameConfig.data.participantsNumber})` : ''
                        }
                        {
                          !game.completed &&
                          !game.closed &&
                          gameConfig.data.participantsNumber === game.participants.length+''
                            ? 'Revealing numbers' + ` (${game.revealCounter}/${gameConfig.data.participantsNumber})` : ''
                        }
                      </h5>

                      <div>
                        <button onClick={(e) => this.completeGame(e, game.id)}>
                          Complete
                        </button>
                        <button onClick={(e) => this.getReward(e, game.id)}>
                          Get reward
                        </button>
                        <button>Close</button>
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
                      Winners
                    </h5>
                    <ul>
                      {
                        game.winners.map((winner, index) => {
                          return <li key={index}>{winner}</li>;
                        })
                      }
                    </ul>

                    <div>
                      <h5>Commit number</h5>
                      <form onSubmit={(event) => this.commitNumber(event, game)}>
                        <input
                          type="number"
                          name="secret"
                          value={this.state.joinGameForm.secret}
                          onChange={this.handleJoinGameChange}/>
                        <input type="submit" value="Join"/>
                      </form>
                    </div>

                    <div>
                      <h5>Reveal number</h5>
                      <form onSubmit={(event) => this.revealNumber(event, game.id)}>
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
                    <hr/>
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

export default App;