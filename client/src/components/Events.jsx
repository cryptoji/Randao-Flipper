import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getShortAddress } from '../utils';
import { handleEvent } from '../actions/events';

class EventsList extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    await this.subscribeEvents();
  }

  async subscribeEvents(getPastEvents = true) {
    const { handleEvent, web3, contract } = this.props;
    try {
      const currentBlock = await web3.eth.getBlockNumber();

      if (getPastEvents) {
        contract.getPastEvents('allEvents', {
          // Events from last 100 blocks
          fromBlock: currentBlock > 100 ? currentBlock - 99 : 0,
          toBlock: 'latest'
        }).then((events) => {
          events.forEach(e => handleEvent(e));
        });
      }

      contract.events.allEvents()
        .on('data', e => handleEvent(e, true))
        .on('changed', (event) => {
          console.log(event)
        })
        .on('error', console.error);
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
      <section>
        <h5 className="mb-3">Events</h5>
        {
          !this.props.events.length ?
            <p className="text-muted">
              Not any event yet.
            </p> : ''
        }
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
                          {getShortAddress(event.data.participant)}
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
                          {getShortAddress(event.data.participant)}
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
                          {getShortAddress(event.data.receiver)}
                        </span>
                        {' '}got{' '}
                        {this.props.web3.utils.fromWei(
                          this.props.web3.utils.toBN(event.data.reward), 'ether')} ETH
                      </small>
                    </div>
                  ) : ''
              }
            </div>
          )).reverse()
        }
      </section>
    );
  }
}

EventsList.propTypes = {
  web3: PropTypes.object.isRequired,
  contract: PropTypes.object.isRequired,
  events: PropTypes.array.isRequired,
  gameConfigs: PropTypes.array.isRequired,
  handleEvent: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  contract: state.blockchain.contract,
  web3: state.blockchain.web3,
  events: state.events.data,
  gameConfigs: state.games.configs,
});

const mapDispatchToProps = dispatch => ({
  handleEvent: (event, updateLists) => dispatch(handleEvent(event, updateLists))
});

const Events = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventsList);

export default Events;
