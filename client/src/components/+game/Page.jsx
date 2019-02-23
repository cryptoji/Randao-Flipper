import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Row,
  Col
} from 'reactstrap';

import GameParticipants from './Participants';
import GameActions from './Actions';
import GameDetails from './Details';

class GamePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const game = this.props.game;
    return (
      <section className="mb-4">
        {
          game ?
            (
              <Row>
                <Col className="mb-3" md="6" lg="4" xl="3">
                  <GameDetails game={game}/>
                </Col>
                <Col className="" md="6" lg="4">
                  <GameActions/>
                </Col>
                <Col md="12" lg="4" xl="5">
                  <GameParticipants participants={game.participants}/>
                </Col>
              </Row>
            )
            :
            (
              <p className="text-muted">Loading game...</p>
            )
        }
      </section>
    );
  }
}

GamePage.propTypes = {
  game: PropTypes.object,
  account: PropTypes.string.isRequired
};

const mapStateToProps = (state, props) => {
  const { gameId } = props.match.params;
  return {
    game: state.games.data.find(game => game.id === gameId),
    account: state.blockchain.accounts[0]
  };
}

const mapDispatchToProps = dispatch => ({

});

const Game = connect(
  mapStateToProps,
  mapDispatchToProps
)(GamePage);

export default Game;