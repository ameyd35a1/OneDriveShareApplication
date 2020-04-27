import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from 'reactstrap';
import { UserAgentApplication } from "msal";
import config from "./Config";
import ErrorMessage from './ErrorMessage';
import NavBar from './NavBar';
import { getUserDetails } from './GraphService';
import MainContent from './MainContent';
import 'bootstrap/dist/css/bootstrap.css';
import '../static/styles/styles.scss'

class App extends React.Component {
    constructor(props) {
        super(props);

        this.UserAgentApplication = new UserAgentApplication({
            auth: {
                clientId: config.clientId,
                redirectUri: config.redirectUri,
            },
            cache: {
                cacheLocation: 'localStorage',
                storeAuthStateInCookie: true,
            }
        });

        var user = this.UserAgentApplication.getAccount();

        this.state = {
            isAuthenticated: (user != null),
            user: {},
            error: null,
            accessToken: null,
            theme: document.getElementById("application").className
        }

        if (user) {
            //Populate user details
            this.getUserProfile();
        }
    }

    setTheme(param) {
        this.setState({ ...this.state, theme: param });
    }

    async componentWillMount() {
        try {
            if (!this.state.isAuthenticated) {
                this.UserAgentApplication.handleRedirectCallback(async () => {
                    await this.getUserProfile();
                });

                this.UserAgentApplication.loginRedirect(config.scopes);
            }
        }
        catch (err) {
            this.UserAgentApplication.loginRedirect(config.scopes);
            //var error = {};

            //if (typeof (err) === 'string') {
            //    var errParts = err.split('|');
            //    error = errParts.length > 1 ?
            //        { message: errParts[1], debug: errParts[0] } :
            //        { message: err };
            //} else {
            //    error = {
            //        message: err.message,
            //        debug: JSON.stringify(err)
            //    };
            //}

            //this.setState({
            //    isAuthenticated: false,
            //    user: null,
            //    error: error,
            //    accessToken: null
            //});
        }
    }

    render() {
        let error = null;
        if (this.state.error) {
            error = <ErrorMessage message={this.state.error.message} debug={this.state.error.debug} />
        }

        return (
            <Router>
                <div>
                    <NavBar isAuthenticated={this.state.isAuthenticated}
                        user={this.state.user}
                        authButtonMethod={this.state.isAuthenticated ? this.logout.bind(this) : this.login.bind(this)}
                        setThemeMethod={this.setTheme.bind(this)} />
                    <Container>
                        {error}
                        <Route path="/" render={(props) =>
                            <MainContent {...props}
                                isAuthenticated={this.state.isAuthenticated}
                                user={this.state.user}
                                authButtonMethod={this.login.bind(this)}
                                accessToken={this.state.accessToken}
                                theme={this.state.theme} />
                        } />
                    </Container>
                </div>
            </Router>
        );
    }

    setErrorMessage(message, debug) {
        this.setState({
            error: { message: message, debug: debug }
        });
    }

    async login() {
        try {
            await this.UserAgentApplication.loginPopup({
                scopes: config.scopes,
                prompt: "select_account"
            });
            await this.getUserProfile();
        }
        catch (err) {
            var error = {};

            if (typeof (err) === 'string') {
                var errParts = err.split('|');
                error = errParts.length > 1 ?
                    { message: errParts[1], debug: errParts[0] } :
                    { message: err };
            } else {
                error = {
                    message: err.message,
                    debug: JSON.stringify(err)
                };
            }

            this.setState({
                isAuthenticated: false,
                user: null,
                error: error,
                accessToken: null
            });
        }
    }

    logout() {
        this.UserAgentApplication.logout();
    }

    async getUserProfile() {
        try {
            var userToken = await this.UserAgentApplication.acquireTokenSilent({
                scopes: config.scopes
            });
            console.log(userToken);

            if (userToken) {
                var user = await getUserDetails(userToken.accessToken);

                this.setState({
                    isAuthenticated: true,
                    user: { displayName: user.displayName, email: user.mail || user.principalName },
                    error: null,
                    accessToken: userToken.accessToken
                });
            }
        }
        catch (err) {
            var error = {};
            if (typeof (err) === 'string') {
                var errParts = err.split('|');
                error = errParts.length > 1 ?
                    { message: errParts[1], debug: errParts[0] } :
                    { message: err };
            } else {
                error = {
                    message: err.message,
                    debug: JSON.stringify(err)
                };
            }

            this.setState({
                isAuthenticated: false,
                user: {},
                error: error,
                accessToken: null
            });
        }
    }
}

export default App;