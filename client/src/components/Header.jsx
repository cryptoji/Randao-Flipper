import React from 'react';
import { connect } from 'react-redux';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  // Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { getShortAddress } from '../utils/index';

class HeaderContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <Link to={`/`} className="navbar-brand">
            Randao Flipper
          </Link>

          <NavbarToggler onClick={this.toggle}/>

          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink>Blog</NavLink>
              </NavItem>
              <NavItem>
                <NavLink>Tutorial</NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  target="blank"
                  href="https://docs.google.com/document/d/1D0AhhxBUbztEDEorN_ol2-Gbk1wSesnEPdI40t8jg_w/edit?usp=sharing">
                  White paper
                </NavLink>
              </NavItem>
              {
                this.props.account ?
                  (
                    <UncontrolledDropdown nav inNavbar>
                      <DropdownToggle nav caret>
                        <span className="text-success">
                          {getShortAddress(this.props.account)}
                        </span>
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem disabled>
                          Balance {this.props.balance} ETH
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>
                          <span className="text-success">Buy ETH</span>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  ) : ''
              }
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

HeaderContainer.propTypes = {
  account: PropTypes.string,
  balance: PropTypes.number
};

const mapStateToProps = (state) => ({
  account: state.blockchain.accounts[0],
  balance: state.blockchain.balance
});

const Header = connect(
  mapStateToProps
)(HeaderContainer);

export default Header;