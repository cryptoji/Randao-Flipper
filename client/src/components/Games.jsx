import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import GameCard from './+game/Card';

class GamesList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section>
        <h1>Games</h1>
        {
          this.props.games.length ?
            (
              <Row>
                {
                  this.props.games
                    .sort((a, b) => a.id - b.id)
                    .map((game, index) => (
                      <Col key={index} xs="12" sm="6" lg="4">
                        <GameCard game={game}/>
                      </Col>
                    ))
                    .reverse()
                }
              </Row>
            ) :
            (
              this.props.isLoading ?
                <p className="text-muted">Loading games...</p> :
                <p className="text-muted">Not any created games yet</p>
            )
        }
      </section>
    );
  }
}

GamesList.propTypes = {
  games: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  games: state.games.data,
  isLoading: state.games.gamesIsLoading
});

const Games = connect(
  mapStateToProps
)(GamesList);

export default Games;
