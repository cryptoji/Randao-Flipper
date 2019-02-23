import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Container, Row, Col } from 'reactstrap';

import { getShortAddress } from './utils/index';

import Game from './components/+game/Page';
import Header from './components/Header';
import Games from './components/Games';
import Actions from './components/Actions';
import Events from './components/Events';

import { fetchGame, fetchGameConfig } from './actions/games';
import {
  initContract,
  initAccounts,
  initWeb3,
  fetchOwner,
  fetchBalance,

  setWeb3,
  setOwner,
  setIsOwner,
  setContract,
  setAccounts,
  setBalance
} from './actions/blockchain';
import {
  loadConfigs,
  loadGames
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
      loadGames
    } = this.props;

    await initWeb3();
    await initAccounts();
    await initContract();
    await fetchOwner();

    await loadConfigs();
    await loadGames();

    if (this.props.accounts.length) {
      await fetchBalance();
    }

    // if (window.location.pathname.includes('/game/')) {
    //   const _gameId = window.location.pathname.match(/\/game\/(\d+)/)[1];
    //   await this.fetchGame(_gameId);
    // }
  }

  render() {
    return (
      <Router>
        <main>
          <Header/>
          <Container fluid={true}>
            {
              this.props.accounts.length && this.props.contract ?
                (
                  <Row className="mt-3">
                    {
                      // Owner access
                      this.props.isOwner ?
                        <Col xs="12">
                          <Actions/>
                        </Col> : ''
                    }
                    <Col sm="8" lg="9">
                      <Route exact path="/" component={Games}/>
                      <Route path="/game/:gameId" component={Game}/>
                    </Col>
                    <Col sm="4" lg="3">
                      <section className="mb-4">
                        <h5>Statistics</h5>
                        <ul className="list-unstyled">
                          <li>
                            <small className="text-muted">
                              Current block 2141
                            </small>
                            <hr/>
                          </li>
                          <li>
                            <small className="text-muted">
                              Contract address
                            </small>
                            <br/>
                            <small className="text-primary">
                              {getShortAddress(this.props.contract.options.address)}
                            </small>
                          </li>
                          <li>
                            <small className="text-muted">
                              Contract owner
                            </small>
                            <br/>
                            <small className="text-primary">
                              {getShortAddress(this.props.owner)}
                            </small>
                          </li>
                          <li>
                            <small className="text-muted">
                              Owner reward 3%
                            </small>
                          </li>
                          <li>
                            <small className="text-muted">
                              Total games {this.props.gamesCount}
                            </small>
                          </li>
                          <li>
                            <small className="text-muted">
                              Total winners N/a
                            </small>
                          </li>
                          <li>
                            <small className="text-muted">
                              Total fund N/a ETH
                            </small>
                          </li>
                        </ul>
                        <hr/>
                      </section>
                      {this.props.configs.length ? <Events/> : ''}
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
  web3: PropTypes.object,
  owner: PropTypes.string,
  isOwner: PropTypes.bool,
  contract: PropTypes.object,
  accounts: PropTypes.array,
  gamesCount: PropTypes.number,
  configs: PropTypes.array,
  // Actions
  initWeb3: PropTypes.func.isRequired,
  initAccounts: PropTypes.func.isRequired,
  initContract: PropTypes.func.isRequired,
  fetchOwner: PropTypes.func.isRequired,
  fetchBalance: PropTypes.func.isRequired,

  setWeb3: PropTypes.func.isRequired,
  setOwner: PropTypes.func.isRequired,
  setIsOwner: PropTypes.func.isRequired,
  setContract: PropTypes.func.isRequired,
  setAccounts: PropTypes.func.isRequired,
  fetchGame: PropTypes.func.isRequired,
  fetchGameConfig: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  web3: state.blockchain.web3,
  contract: state.blockchain.contract,
  accounts: state.blockchain.accounts,
  owner: state.blockchain.owner,
  isOwner: state.blockchain.isOwner,

  gamesCount: state.games.data.length,
  configs: state.games.configs
});

const mapDispatchToProps = dispatch => ({
  initWeb3: () => dispatch(initWeb3()),
  initAccounts: () => dispatch(initAccounts()),
  initContract: () => dispatch(initContract()),
  fetchBalance: () => dispatch(fetchBalance()),
  fetchOwner: () => dispatch(fetchOwner()),
  loadConfigs: () => dispatch(loadConfigs()),
  loadGames: () => dispatch(loadGames()),

  setWeb3: web3 => dispatch(setWeb3(web3)),
  setOwner: owner => dispatch(setOwner(owner)),
  setIsOwner: owner => dispatch(setIsOwner(owner)),
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