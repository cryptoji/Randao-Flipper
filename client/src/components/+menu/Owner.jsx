import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import { toggleModal } from '../../actions/modals';
import CreateConfigModal from '../+modals/CreateConfig';
import CreateGameModal from '../+modals/CreateGame';

const MenuOwnerComponent = ({ gameConfigsLength, modals, toggleModal }) => (
  <div>
    <Nav tabs>
      <NavItem>
        {
          gameConfigsLength ?
            <NavLink
              active={modals.createGame.isOpen}
              onClick={(_) => toggleModal('createGame')}>
              Create game
            </NavLink>
            : ''
        }
      </NavItem>
      <NavItem>
        <NavLink
          active={modals.createConfig.isOpen}
          onClick={(_) => toggleModal('createConfig')}>
          Create config
        </NavLink>
      </NavItem>
    </Nav>

    <CreateConfigModal/>
    <CreateGameModal/>
  </div>
);

MenuOwnerComponent.propTypes = {
  modals: PropTypes.object.isRequired,
  gameConfigsLength: PropTypes.number.isRequired,
  toggleModal: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  modals: state.modals,
  gameConfigsLength: state.games.data.length
});

const mapDispatchToProps = dispatch => ({
  toggleModal: modalId => dispatch(toggleModal(modalId))
});

const MenuOwner = connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuOwnerComponent);

export default MenuOwner;