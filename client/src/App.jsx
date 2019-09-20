import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Container, Row, Col } from 'reactstrap';

import Game from './components/Game';
import Header from './components/Header';
import Games from './components/Games';
import Menu from './components/Menu';
import Events from './components/Events';
import Statistics from './components/Statistics';

import {
  initContract,
  initAccounts,
  initWeb3,
  fetchOwner,
  fetchBalance,
  fetchNetworkInfo,
  listenNetworkInfo
} from './actions/blockchain';
import {
  fetchContractStatistics,
  loadConfigs,
  loadGames,
  loadGame
} from './actions/games';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const {
      initWeb3,
      initAccounts,
      initContract,
      fetchOwner,
      fetchBalance,
      loadConfigs,
      fetchGame,
      loadGames,
      fetchNetworkInfo,
      fetchContractStatistics,
      listenNetworkInfo
    } = this.props;

    await initWeb3();
    await initAccounts();
    await initContract();
    await fetchOwner();

    await loadConfigs();
    await loadGames();

    await fetchNetworkInfo();
    await fetchContractStatistics();

    if (this.props.accounts.length) {
      await fetchBalance();
    }

    if (window.location.pathname.includes('/game/')) {
      const _gameId = window.location.pathname.match(/\/game\/(\d+)/)[1];
      await fetchGame(_gameId);
    }

    await listenNetworkInfo();
  }

  render() {
    return (
      <Router>
        <main>
          <Header/>
          <Container fluid={true}>
            {
              this.props.appIsReady ?
                (
                  <Row className="mt-3">
                    <Col sm="8" lg="9">
                      <Menu/>
                      <Route exact path="/" component={Games}/>
                      <Route path="/game/:gameId" component={Game}/>
                    </Col>

                    <Col sm="4" lg="3">
                      <Statistics/>
                      <Events/>
                    </Col>
                  </Row>
                ) :
                (
                  <div className="mt-5 text-center">
                    <h3 className="lead">Loading application...</h3>
                    <p className="text-muted">
                      If you see this text always you will need
                      install the MetaMask extension for your Chrome
                      or Firefox browser. See you later :)
                    </p>
                  </div>
                )
            }
          </Container>
        </main>
      </Router>
    );
  }
}

AppComponent.propTypes = {
  // Props
  appIsReady: PropTypes.bool,
  web3: PropTypes.object,
  // Actions
  initWeb3: PropTypes.func.isRequired,
  initAccounts: PropTypes.func.isRequired,
  initContract: PropTypes.func.isRequired,
  fetchOwner: PropTypes.func.isRequired,
  fetchBalance: PropTypes.func.isRequired,
  fetchNetworkInfo: PropTypes.func.isRequired,
  fetchContractStatistics: PropTypes.func.isRequired,
  listenNetworkInfo: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  web3: state.blockchain.web3,
  accounts: state.blockchain.accounts,
  appIsReady: !!(state.blockchain.accounts.length && state.blockchain.contract)
});

const mapDispatchToProps = dispatch => ({
  initWeb3: () => dispatch(initWeb3()),
  initAccounts: () => dispatch(initAccounts()),
  initContract: () => dispatch(initContract()),
  fetchBalance: () => dispatch(fetchBalance()),
  fetchOwner: () => dispatch(fetchOwner()),
  loadConfigs: () => dispatch(loadConfigs()),
  loadGames: () => dispatch(loadGames()),
  fetchGame: gameId => dispatch(loadGame(gameId)),
  fetchNetworkInfo: () => dispatch(fetchNetworkInfo()),
  fetchContractStatistics: () => dispatch(fetchContractStatistics()),
  listenNetworkInfo: () => dispatch(listenNetworkInfo())
});

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);

export default App;
