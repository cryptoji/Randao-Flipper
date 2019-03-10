import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getShortAddress } from '../utils';
import { subscribeEvents } from '../actions/events';

class EventsList extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    await this.props.subscribeEvents();
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.eventScrollArea.scrollIntoView({ behavior: "smooth" });
  }

  render() {
    const shortAddressLength = 5;
    return (
      <section>
        <h5 className="mb-3">Events</h5>
        {
          !this.props.events.length ?
            <p className="text-muted">
              Not any event yet.
            </p> : ''
        }
        <div
          style={{
            'height': '270px',
            'overflowX': 'scroll'
          }}>
          {
            this.props.events.map((event, index) => (
              <div key={index} className="mb-1">
                {
                  event.type === 'GameCreated' ?
                    (
                      <div>
                        <small>
                          The <Link to={`/game/${event.data.id}`}>
                          Game {event.data.id}
                        </Link> created by owner
                        </small>
                      </div>
                    ) : ''
                }
                {
                  event.type === 'GameConfigurationCreated' ?
                    (
                      <div>
                        <small>
                        <span>
                          Owner created new configuration
                        </span>
                        </small>
                      </div>
                    ) : ''
                }
                {
                  event.type === 'NumberCommited' ?
                    (
                      <div>
                        <small>
                        <span className="text-primary">
                          {getShortAddress(event.data.participant, shortAddressLength)}
                        </span> joined to{' '}
                          <Link to={`/game/${event.data.gameId}`}>
                            Game {event.data.gameId}
                          </Link>
                        </small>
                      </div>
                    ) : ''
                }
                {
                  event.type === 'NumberRevealed' ?
                    (
                      <div>
                        <small>
                        <span className="text-primary">
                          {getShortAddress(event.data.participant, shortAddressLength)}
                        </span> reveal number in{' '}
                          <Link to={`/game/${event.data.gameId}`}>
                            Game {event.data.gameId}
                          </Link>
                        </small>
                      </div>
                    ) : ''
                }
                {
                  event.type === 'GameCompleted' ?
                    (
                      <div>
                        <small>
                          <Link to={`/game/${event.data.gameId}`}>
                            Game {event.data.gameId}
                          </Link> is completed
                        </small>
                      </div>
                    ) : ''
                }
                {
                  event.type === 'RewardSent' ?
                    (
                      <div>
                        <small>
                        <span className="text-primary">
                          {getShortAddress(event.data.receiver, shortAddressLength)}
                        </span>
                          {' '}got{' '}
                          {
                            this.props.web3.utils.fromWei(
                              this.props.web3.utils.toBN(event.data.reward).toString(),
                              'ether'
                            )
                          } ETH
                        </small>
                      </div>
                    ) : ''
                }
              </div>
            )) //.reverse()
          }

          <div style={{ display: 'hidden' }} ref={(e) => this.eventScrollArea = e}/>
        </div>
      </section>
    );
  }
}

EventsList.propTypes = {
  web3: PropTypes.object.isRequired,
  events: PropTypes.array.isRequired,
  gameConfigs: PropTypes.array.isRequired,
  subscribeEvents: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  web3: state.blockchain.web3,
  events: state.events.data,
  gameConfigs: state.games.configs,
});

const mapDispatchToProps = dispatch => ({
  subscribeEvents: () => dispatch(subscribeEvents())
});

const Events = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventsList);

export default Events;
