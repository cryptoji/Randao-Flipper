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
      this.setState({ web3, accounts, contract });
      this.loadSessions();
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
          [name]: type === 'number' ? parseInt(value) : value
        }
      };
    }, () => console.log(this.state.createSessionForm));
  }

  // --------------------------
  // Utils
  canJoinToSession = ({ creator, participants }) => {
    const account = this.state.accounts[0];
    if(participants.findIndex(address => address === account) >= 0) {
      return false;
    }
    return account !== creator;
  }

  // -------------------------
  // Async block chain methods
  loadSessions = async() => {
    const { contract } = this.state;
    const numberOfSessions = await contract.methods.numberOfGameSessions().call();
    const gameSessions = [];

    for(let i = 0; i < numberOfSessions; i++) {
      const session = await contract.methods.getSession(i).call();
      gameSessions.push(session);
    }

    this.setState({
      gameSessions,
      numberOfSessions
    });
  }

  joinToSession = async(event, sessionID) => {
    event.preventDefault();

    const { accounts, contract } = this.state;
    await contract.methods.joinSession(sessionID).send({
      from: accounts[0],
      value: this.state.gameSessions[sessionID].betAmount
    });

    this.loadSessions();
  }

  createGameSession = async(event) => {
    event.preventDefault();

    const { web3, accounts, contract, createSessionForm } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.createSession(
      web3.utils.toHex(createSessionForm.betAmount*10**18),
      createSessionForm.percentOfWinners,
      createSessionForm.numberOfParticipants
    ).send({
      from: accounts[0],
      value: createSessionForm.betAmount*10**18
    });

    const createdSession = await contract.methods.getSession(this.state.numberOfSessions).call();
    this.setState(prevState => {
      return {
        gameSessions: [...prevState.gameSessions, createdSession]
      };
    });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Tokens Flipper</h1>
        <ul>
          <li>Wins fund: 1023.3356 ETH</li>
          <li>Number of sessions: {this.state.numberOfSessions}</li>
          <li>Number of winners: {this.state.numberOfSessions}</li>
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
          {this.state.gameSessions.map((session, index) => {
            const { web3 } = this.state;
            return (
              <div key={index}>
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
                  <strong>Creator:</strong>
                  {session.creator}
                </div>
                <div>
                  <h4>Participants</h4>
                  {session.participants.map((participant, index) => {
                    return (<li key={index}>{participant}</li>);
                  })}
                </div>
                {
                  this.canJoinToSession(session) ?
                    <button
                      onClick={(event) => this.joinToSession(event, index)}>
                      Join to session
                    </button> :
                    <p><i>You are joined to this session</i></p>
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
