import React, { Component } from "react";
import TokensFlipperContract from "./contracts/TokensFlipper.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Form
      createSessionForm: {
        numberOfParticipants: 20,
        percentOfWinners: 10,
        betAmount: 0.1,
      },

      // State
      gameSessions: [],
      numberOfSessions: 0,
      numberOfWinners: 0,
      totalWinsFund: 0,

      // Constants
      web3: null,
      accounts: null,
      contract: null
    };
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = TokensFlipperContract.networks[networkId];
      const contract = new web3.eth.Contract(
        TokensFlipperContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3,
        accounts,
        contract
      });

      // Initial load of data
      await this.loadStatistics();
      await this.loadSessions();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  // -------------------------
  // Form handlers
  handleInputChange = (event) => {
    const { value, name, type } = event.target;
    this.setState(prevState => {
      return {
        createSessionForm: {
          ...prevState.createSessionForm,
          [name]: type === 'number' ? parseFloat(value) : value
        }
      };
    });
  }

  // --------------------------
  // Utils
  canJoinSession = ({ creator, participants }) => {
    const account = this.state.accounts[0];
    if(participants.findIndex(address => address === account) >= 0) {
      return false;
    }
    return account !== creator;
  }

  isSessionOwner = (creator) => {
    const account = this.state.accounts[0];
    return account === creator;
  }

  // -------------------------
  // Async block chain methods
  loadStatistics = async() => {
    const { contract } = this.state;
    try {
      const numberOfActiveSessions = await contract.methods.numberOfActiveSessions().call();
      const numberOfSessions = await contract.methods.numberOfSessions().call();
      const numberOfWinners = await contract.methods.numberOfWinners().call();
      const totalWinsFund = await contract.methods.totalWinsFund().call();

      this.setState({
        numberOfActiveSessions,
        numberOfSessions,
        numberOfWinners,
        totalWinsFund
      });
    } catch (e) {
      console.error(e);
    }
  }

  loadSessions = async() => {
    const { contract, numberOfSessions } = this.state;
    const gameSessions = [];

    if(numberOfSessions <= 0) {
      return;
    }

    for(let i = 0; i < numberOfSessions; i++) {
      try {
        const session = await contract.methods.getSession(i).call();
        gameSessions.push(session);
      } catch (e) {
        console.error(e);
      }
    }

    this.setState({ gameSessions: gameSessions.reverse() });
  }

  joinSession = async(event, sessionID) => {
    const { accounts, contract } = this.state;
    const value = this.state.gameSessions
      .find(session => session.index === sessionID)
      .betAmount;

    try {
      await contract.methods
        .joinSession(sessionID)
        .send({
          from: accounts[0],
          value
        });

      await this.loadSessions();
      await this.loadStatistics();
    } catch (e) {
      console.error(e);
    }
  }

  removeSession = async(event, sessionID) => {
    const { contract, accounts } = this.state;

    const isConfirmedAction = window.confirm("Are you sure want to remove a game session?");

    if(isConfirmedAction) {
      try {
        await contract.methods
          .removeSession(sessionID)
          .send({ from: accounts[0] });

        this.setState(prevState => {
          return {
            gameSessions: prevState.gameSessions.reduce((memo, session) => {
                if(session.index === sessionID) {
                  memo.push(Object.assign(session, { isClosed: true }));
                } else {
                  memo.push(session);
                }
                return memo;
              }, [])
          };
        });

        await this.loadStatistics();
      } catch (e) {
        console.error(e);
      }
    }
  }

  createGameSession = async(event) => {
    event.preventDefault();

    const { web3, accounts, contract, createSessionForm } = this.state;

    try {
      // Stores a given value, 5 by default.
      await contract.methods
        .createSession(
          web3.utils.toHex(createSessionForm.betAmount*10**18),
          createSessionForm.percentOfWinners,
          createSessionForm.numberOfParticipants
        )
        .send({
          from: accounts[0],
          value: createSessionForm.betAmount*10**18
        });

      const createdSession = await contract.methods
        .getSession(this.state.numberOfSessions)
        .call();

      this.setState(prevState => {
        const updatedSessions = [...prevState.gameSessions.reverse(), createdSession];
        return {
          gameSessions: updatedSessions.reverse()
        };
      });

      await this.loadStatistics();
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    if (!this.state.web3) {
      return (
        <div className="App">Loading Tokens Flipper...</div>
      );
    }
    return (
      <div className="App">
        <h1>Tokens Flipper</h1>
        <ul>
          <li>Wins fund: {this.state.totalWinsFund} ETH</li>
          <li>Number of active sessions: {this.state.numberOfActiveSessions}</li>
          <li>Number of sessions: {this.state.numberOfSessions}</li>
          <li>Number of winners: {this.state.numberOfWinners}</li>
        </ul>
        <section>
          <h3>Create new session</h3>
          <form onSubmit={this.createGameSession}>
            <div>
              <label htmlFor="betAmount">Bet amount: </label>
              <input
                type="number"
                id="betAmount"
                name="betAmount"
                value={this.state.createSessionForm.betAmount}
                onChange={this.handleInputChange}/>
            </div>
            <div>
              <label htmlFor="percentOfWinners">% of winners: </label>
              <input
                type="number"
                id="percentOfWinners"
                name="percentOfWinners"
                value={this.state.createSessionForm.percentOfWinners}
                onChange={this.handleInputChange}/>
            </div>
            <div>
              <label htmlFor="numberOfParticipants">No. of participants: </label>
              <input
                type="number"
                id="numberOfParticipants"
                name="numberOfParticipants"
                value={this.state.createSessionForm.numberOfParticipants}
                onChange={this.handleInputChange}/>
            </div>

            <input type="submit" value="Create new session"/>
          </form>
          <hr/>
        </section>
        <section>
          <h3>Sessions list</h3>
          {this.state.gameSessions.map((session) => {
            const { web3 } = this.state;
            return (
              <div key={session.index}>
                <h2>#{session.index}</h2>
                <div>
                  <strong>Bet amount:</strong>
                  {web3.utils.fromWei(session.betAmount)} ETH
                </div>
                <div>
                  <strong>Number of participants:</strong>
                  {session.participants.length}/{session.numberOfParticipants}
                </div>
                <div>
                  <strong>Percent of winners:</strong>
                  {session.percentOfWinners}%
                </div>
                <div>
                  <h4>Participants</h4>
                  {session.participants.map((participant, index) => {
                    return (<li key={index}>{participant}</li>);
                  })}
                </div>
                <div>
                  <h5>Creator: {session.creator}</h5>
                </div>
                {
                  (session.isClosed || session.isCompleted) ?
                    (
                      <div>
                        <p>
                          {session.isClosed ? <strong style={{'color': 'red'}}>This session is closed by creator</strong> : ''}
                          {session.isCompleted ? <strong style={{'color': 'green'}}>This session is completed</strong> : ''}
                        </p>
                        {
                          session.isCompleted ?
                            <div>
                              <h4>Winners</h4>
                              {session.winners.map((winner, index) => {
                                return (<li key={index}>{winner}</li>);
                              })}
                            </div>: ''
                        }
                      </div>
                    ):
                    (
                      <div>
                        {
                          this.canJoinSession(session) ?
                            <button
                              onClick={(event) => this.joinSession(event, session.index)}>
                              Join to session
                            </button> :
                            <p><i>You are joined to this session</i></p>
                        }
                        {
                          this.isSessionOwner(session.creator) ?
                            <button
                              onClick={(event) => this.removeSession(event, session.index)}>
                              Remove
                            </button> :
                            ''
                        }
                      </div>
                    )
                }
                <hr/>
              </div>
            );
          })}
        </section>
      </div>
    );
  }
}

export default App;
