import React from 'react';
import PermissionDropdown from './PermissionDropdown';
import Person from './Person';
import { Button, Spinner } from 'reactstrap';
import { postShareItem } from './GraphService';

export default class RowItem extends React.Component {
    ///Props = index, id, name, webUrl, users, permission
    constructor(props) {
        super(props);

        this.state = {           
            users_read: props.users_read,
            users_write: props.users_write,
            /*permission: props.permission,*/
            isShared: false,
            loading: false
        }
    }

    componentWillReceiveProps(props) {

    }

    removeUser(email, id) {
        if (this.props.id == id) {
            this.setState({
                ...this.state, users: this.state.users.filter((item) => {
                    return item.email != email;
                })
            });
        }
    }

    onChange(accessLevel) {
        this.setState({...this.state, permission: accessLevel});
    }

    async shareItem() {
        this.setState({ ...this.state, loading: true });
        const item = { shared_read: this.state.users_read, shared_write: this.state.users_write, permission: this.state.permission, id: this.props.id };
        let status_read; let status_write;
        if(item.shared_read.length > 0){
            status_read = await postShareItem(item.shared_read, item.id, "read", this.props.accessToken);
        } else {
            status_read = 'Success';
        }

        if(item.shared_write.length > 0){
            status_write = await postShareItem(item.shared_write, item.id, "write", this.props.accessToken);
        } else {
            status_write = 'Success';
        }

        if (status_read === 'Success' && status_write === 'Success') {
            this.setState({ ...this.state, isShared: true, loading: false});
        }
    }

    render() {
        return (
            <tr>
                <td>{this.props.index + 1}</td>
                <td><a href={this.props.webUrl} id={this.props.id}>{this.props.name}</a></td>
                <td>{this.state.users_read && this.state.users_read.map((val, i) => {
                    return (<Person key={i + val.email} itemId={this.props.id} name={val.name} email={val.email} removeUser={this.removeUser.bind(this)} />);
                })}</td>
                <td>{this.state.users_write && this.state.users_write.map((val, i) => {
                    return (<Person key={i + val.email} itemId={this.props.id} name={val.name} email={val.email} removeUser={this.removeUser.bind(this)} />);
                })}</td>
                {/*<td><PermissionDropdown key={this.props.index} value={this.state.permission} onChange={this.onChange.bind(this)} /></td>*/}
                <td>{!this.state.isShared
                    ? (<Button color="primary" onClick={this.shareItem.bind(this)}>
                        {this.state.loading ? <Spinner as="span" animation="border" size="sm" /> : <span>Share</span>}
                        </Button>)
                    : (<span className="text-success">SHARED</span>)}</td>
            </tr>
            );
    }
}