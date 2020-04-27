import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import Switch from './Switch';
import {
    Collapse,
    Container,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import { PrimaryButton, ExtendedPeoplePicker } from 'office-ui-fabric-react/lib/';
//import '@fortawesome/fontawesome-free/css/all.css';

function UserAvatar(props) {
    if (props.user.avatar) {
        return <img src={props.user.avatar} alt="User"
            className="rounded-circle align-self-center mr-2"
            style={{ width: '32px' }} />;
    }

    return <i
        className="far fa-user-circle fa-lg rounded-circle align-self-center mr-2"
        style={{ width: '32px' }}></i>;
}

function AuthNavItem(props) {
    if (props.isAuthenticated) {
        return (
            <UncontrolledDropdown>
                <DropdownToggle nav caret>
                    <UserAvatar user={props} />
                </DropdownToggle>
                <DropdownMenu right>
                    <h5 className="dropdown-item-text mb-0">{props.user.displayName}</h5>
                    <p className="dropdown-item-text text-muted mb-0">{props.user.email}</p>
                    <DropdownItem divider />
                    <DropdownItem onClick={props.authButtonMethod}>Sign Out</DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        );
    }

    //Not Authenticated
    return (
        <NavItem>
            <NavLink onClick={props.authButtonMethod}>Sign In</NavLink>
        </NavItem>
    );
}

export default class NavBar extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            isOpen: false,
            toggleValue: false,
        }
    }

    componentWillMount() {
        document.getElementById("application").className = "theme-light";
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    toggleTheme() {
        var className = '';
        if (this.state.toggleValue) {
            className = "theme-light";
        } else {
            className = "theme-dark";
        }
        document.getElementById("application").className = className;
        this.setState({ ...this.state, toggleValue: !this.state.toggleValue });
        this.props.setThemeMethod(className);
    }

    render() {

        let calendarLink = null;
        if (this.props.isAuthenticated) {
            calendarLink = (
                <NavItem>
                    <RouterNavLink to="/calendar" className="nav-link" exact>Calendar</RouterNavLink>
                </NavItem>
            );
        }

        return (
            <div>
                <Navbar color="dark" dark expand="md" fixed="top">
                    <Container>
                        <NavbarBrand href="/">Share Documents</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="mr-auto" navbar>
                                <NavItem>
                                    <RouterNavLink to="/" className="nav-link" exact>Home</RouterNavLink>
                                </NavItem>
                                {/*calendarLink*/}
                            </Nav>
                            
                            <Nav className="justify-content-end" navbar>
                                <NavItem>
                                    <Switch isOn={this.state.toggleValue} onColor="#7482FC" handleToggle={this.toggleTheme.bind(this)} />
                                </NavItem>
                                <NavItem>
                                    <NavLink href="https://desai7-my.sharepoint.com/" target="_blank">
                                        <i className="fas fa-external-link-alt mr-1"></i>
                                        OneDrive
                                    </NavLink>
                                </NavItem>
                                <AuthNavItem
                                    isAuthenticated={this.props.isAuthenticated}
                                    authButtonMethod={this.props.authButtonMethod}
                                    user={this.props.user} />
                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
            </div>

        );
    }
}