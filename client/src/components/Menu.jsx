import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import OwnerMenu from './+menu/Owner';

export function getConfigTitle(config) {
  const participants = `${config.participantsNumber} participants`;
  const winners = `${config.winnersNumber} winners`;
  const duration = `${config.duration} blocks duration`;
  return `${participants} / ${winners} / ${duration}`;
}

class MenuContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="mb-3">
        <OwnerMenu/>
      </section>
    );
  }
}

MenuContainer.propTypes = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

const Menu = connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuContainer);

export default Menu;
