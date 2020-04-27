import React from 'react';
import FetchData from './FetchData';
import { Jumbotron, Button, Container, Spinner } from 'reactstrap';


function HeaderContent(props) {
    if (props.isAuthenticated) {
        return (
            <div>
                <h4>Welcome {props.user.displayName}!</h4>
                <p>Below are your OneDrive documents. Share them with others!!</p>
            </div>
        );
    }
    return <Button color="primary" onClick={props.authButtonMethod}>Click here to sign in</Button>;
}

export default class MainContent extends React.Component {

    constructor(props) {
        super(props);

        this.state = { loading: true, theme: props.theme };
    }

    componentWillReceiveProps(props) {
        if (this.props.isAuthenticated) {
            this.setState({ loading: false, theme: props.theme});
        }        
    }

    render() {
        let content = null;
        if (this.props.isAuthenticated) {
            content = <FetchData accessToken={this.props.accessToken} theme={this.state.theme} />;
        }
        return (
            <Container>
                <Jumbotron>
                    <h1>Share OneDrive documents</h1>
                    <p className="lead">This is a POC to share the OneDrive items with users</p>
                    {!this.state.loading && <HeaderContent
                        isAuthenticated={this.props.isAuthenticated}
                        user={this.props.user}
                        authButtonMethod={this.props.authButtonMethod} />}

                    {this.state.loading &&
                        <div>
                            <Spinner animation="border" /> <span>&nbsp;Retrieving your data...</span>
                        </div>
                    }
                </Jumbotron>
                {content}
            </Container>
        );
    }
}