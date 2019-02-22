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

class HeaderContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  getShortAddress() {
    const address = this.props.account;
    const length = address.length;
    return `${address.substring(0, 8)}...${address.substring(length-6, length)}`
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
                <NavLink>White paper</NavLink>
              </NavItem>
              {
                this.props.account ?
                  (
                    <UncontrolledDropdown nav inNavbar>
                      <DropdownToggle nav caret>
                        <span className="text-success">
                          {this.getShortAddress()}
                          </span>
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem disabled>
                          Balance {this.props.balance} ETH <i className="fab fa-ethereum"/>
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