import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Container, Row, Col
} from 'reactstrap';
import GameCard from './GameCard';

const GamesList = ({ games }) => (
  <section>
    <Container>
      <h5>Games</h5>

      {
        games.length ?
          (
            <Row>
              {
                games.map((game, index) => (
                  <Col key={index} md="4">
                    <GameCard game={game}/>
                  </Col>
                )).reverse()
              }
            </Row>
          )
          : <p className="text-muted">Not created any games yet</p>
      }
    </Container>
  </section>
);

GamesList.propTypes = {
  games: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  games: state.games.data
});

const Games = connect(
  mapStateToProps
)(GamesList);

export default Games;