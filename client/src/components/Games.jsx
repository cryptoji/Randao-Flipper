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
        <h5>Games</h5>
        {
          this.props.games.length ?
            (
              <Row>
                {
                  this.props.games
                    .sort((a, b) => a.id - b.id)
                    .map((game, index) => (
                      <Col key={index} xs="12" sm="6" lg="3">
                        <GameCard game={game}/>
                      </Col>
                    ))
                    .reverse()
                }
              </Row>
            ) :
            <p className="text-muted">Not created any games yet</p>
        }
      </section>
    );
  }
}

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