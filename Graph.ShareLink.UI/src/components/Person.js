import React from 'react';

export default class Person extends React.Component {
    constructor(props) {
        super(props);

        this.state = { accessToken: props.accessToken };
    }

    componentWillReceiveProps(props) {
        this.setState({ accessToken: props.accessToken });
    }

    _removeUser(email, id) {
        this.props.removeUser(email, id);
    }

    render() {
        return (
            <div className="person">
                <span>{this.props.name}</span>                
                <span onClick={() => this._removeUser(this.props.email, this.props.itemId)}>x</span>
            </div>

        );
    }
}