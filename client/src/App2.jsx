import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import getWeb3 from './utils/getWeb3';
import RandaoFlipper from './contracts/RandaoFlipper.json';
import PropTypes from 'prop-types';

import { Container, Row, Col } from 'reactstrap';

import Game from './components/Game';
import Header from './components/Header';
import Games from './components/Games';
import Actions from './components/Actions';
import Events from './components/Events';

import { fetchGame, fetchGameConfig } from './actions/games';
import {
  setWeb3,
  setContract,
  setAccounts,
  setBalance
} from './actions/blockchain';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
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

      this.props.setWeb3(web3);
      this.props.setContract(contract);
      this.props.setAccounts(accounts);
    } catch (e) {
      console.error(e);
    }

    await this.fetchConfigs();
    await this.fetchGames();

    if (this.props.accounts.length) {
      await this.fetchAccountBalance();
    }
  }

  async fetchAccountBalance() {
    const { web3, accounts } = this.props;
    const balance = await web3.eth.getBalance(accounts[0]);
    this.props.setBalance(
      parseFloat(web3.utils.fromWei(balance).substring(0, 7))
    );
  }

  async fetchGame(gameId) {
    const { contract, web3 } = this.props;

    try {
      const game = await contract.methods.GameSessions(gameId).call();
      const config = this.props.configs.find((_, i) => i+'' === game.configId);

      this.props.fetchGame({
        ...game,
        config,
        deposit: web3.utils.fromWei(game.deposit, 'ether')
      });
    } catch (e) {
      console.error(e);
    }
  }

  async fetchGames() {
    const { contract } = this.props;
    try {
      const { gamesCount } = await contract.methods.getGamesCount().call();
      let lastIndex = gamesCount - 1;

      if (this.props.gamesCount+'' === gamesCount) return;
      if (this.props.gamesCount > 0) {
        lastIndex = gamesCount - this.props.gamesCount;
      }

      for(let i = 1; i <= lastIndex; i++) {
        await this.fetchGame(i);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async fetchConfig(configId) {
    const { contract } = this.props;

    try {
      const config = await contract.methods.GameConfigurations(configId).call();
      this.props.fetchGameConfig(config);
    } catch (e) {
      console.error(e);
    }
  }

  async fetchConfigs() {
    const { contract } = this.props;

    try {
      const { configurationsCount } = await contract.methods.getConfigurationsCount().call();
      for(let i = configurationsCount-1; i >= 0; i--) {
        await this.fetchConfig(i);
      }
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
      <Router>
        <main>
          <Header/>
          <Container fluid={true}>
            <Row className="mt-3">
              <Col md="2">
                {
                  this.props.accounts[0] ?
                    <Actions updateBalance={this.fetchAccountBalance.bind(this)}/>
                    : ''
                }
              </Col>
              <Col md="8">
                <Route exact path="/" component={Games}/>
                <Route exact path="/game/:gameId" component={Game}/>
              </Col>
              <Col md="2">
                {
                  this.props.contract ?
                    <Events
                      updateConfigs={this.fetchConfigs.bind(this)}
                      updateGame={this.fetchGame.bind(this)}/>
                    : ''
                }
              </Col>
            </Row>
          </Container>
        </main>
      </Router>
    );
  }
}

AppComponent.propTypes = {
  // Props
  web3: PropTypes.object,
  contract: PropTypes.object,
  accounts: PropTypes.array,
  gamesCount: PropTypes.number,
  configs: PropTypes.array,
  // Actions
  setWeb3: PropTypes.func.isRequired,
  setContract: PropTypes.func.isRequired,
  setAccounts: PropTypes.func.isRequired,
  fetchGame: PropTypes.func.isRequired,
  fetchGameConfig: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  web3: state.blockchain.web3,
  contract: state.blockchain.contract,
  accounts: state.blockchain.accounts,
  gamesCount: state.games.data.length,
  configs: state.games.configs
});

const mapDispatchToProps = dispatch => ({
  setWeb3: web3 => dispatch(setWeb3(web3)),
  setContract: contract => dispatch(setContract(contract)),
  setAccounts: accounts => dispatch(setAccounts(accounts)),
  setBalance: balance => dispatch(setBalance(balance)),
  fetchGame: game => dispatch(fetchGame(game)),
  fetchGameConfig: config => dispatch(fetchGameConfig(config))
});

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);

export default App;