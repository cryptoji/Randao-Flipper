import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
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
          this.props.events.map((event, index) => (
            <div key={index} className="mb-1">
              {
                event.type === 'GameCreated' ?
                  (
                    <div>
                      <small>
                        Owner created <Link to={`/game/${event.data.id}`}>
                          Game {event.data.id}
                        </Link>
                      </small>
                    </div>
                  ) : ''
              }
              {
                event.type === 'GameConfigurationCreated' ?
                  (
                    <div>
                      <small>
                        <span>Owner created configuration</span>
                        {
                          event.config ?
                            <ul className="list-unstyled text-muted">
                              <li>- Participants {event.config.participantsNumber}</li>
                              <li>- Winners {event.config.winnersNumber}</li>
                              <li>- Duration {event.config.duration}</li>
                            </ul> : ''
                        }
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
