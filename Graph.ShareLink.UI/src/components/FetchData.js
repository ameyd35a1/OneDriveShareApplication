import React from 'react';
import { getDriveItems, getDriveItemsFromData } from './GraphService';
import { Table, Button, Spinner } from 'reactstrap';
//import Person from './Person';
//import PermissionDropdown from './PermissionDropdown';
import RowItem from './RowItem';

export default class FetchData extends React.Component {

    constructor(props) {
        super(props);

        this.state = { driveItems: null, loading: false, accessToken: null, theme: null }
    }

    componentWillReceiveProps(props) {
        if (this.state.accessToken != props.accessToken) {
            this.setState({ ...this.state, loading: true, accessToken: props.accessToken });
            this.fetchDriveItems(props.accessToken);
        }
        else {
            this.setState({ ...this.state, theme: props.theme });
        }
        //this.fetchUsers(props.accessToken);
    }

    async fetchUsers(accessToken) {

    }

    async fetchDriveItems(accessToken) {
        if (accessToken) {
            let items = [];
            //let users = [];
            let data = await getDriveItemsFromData(accessToken);
            //console.log("DidMount", data);

            //data.forEach(item => {
            //    items.push({ id: item.id, name: item.name, url: item.webUrl, isFolder: item.folder ? true : false, sharedWith: users });
            //});
            data.forEach(item => {
                let arr = item.sharedWith.toString().split(';');
                let ids = [];
                for (let index = 0; index < arr.length; index++) {
                    ids.push({ name: arr[index].split('|')[0], email: arr[index].split('|')[1] });
                }
                //delete item["sharedWith"];
                items.push({ ...item, shared: ids });
            });

            const paths = [...new Set(data.map(x => x.t))];
            var items_modified= []
            paths.forEach(function(item, index) {    
                var res= data.filter(function(a){         
                    if(a.path === item)
                        return a;
                }).map(function( obj ) {
                    return obj.sharedWith;
                });
                items_modified.push({id: index, t: item, s: res}); 
            });

            console.log(items);
            if (data) {
                this.setState({...this.state, driveItems: items, loading: false });
            }
        }
    }

    componentDidMount() { }

    async shareItem() {

    }

    removeUser(email, id) {
        let items = this.state.driveItems.map((item) => {
            if (item.id == id) {
                let users = item.shared.filter((user) => {
                    return user.email != email;
                });
                item.shared = users;
                return item;
            }
            return item;
        });
        this.setState({ ...this.state, driveItems: items });
    }

    shareItem() {

    }

    render() {
        //this.fetchDriveItems();
        return (
            <React.Fragment>
                <div id="content"> {this.state.driveItems &&
                    <Table striped hover dark={this.state.theme == "theme-dark" ? true : false}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Share with</th>
                                <th>Permission to Provide</th>
                                <th>Share Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.driveItems.map((item, index) => (
                                <RowItem key={index}
                                    index={index} id={item.id}
                                    name={item.name}
                                    webUrl={item.webUrl}
                                    users={item.shared}
                                    permission={item.permission}
                                    accessToken={this.state.accessToken} />
                            ))}
                        </tbody>
                    </Table>}
                </div>
                <div>
                    {this.state.loading &&
                        <div>
                            <Spinner animation="border" variant="light" className="text-success" /> <span className="text-success">&nbsp;Fetching your files...</span>
                        </div>
                    }
                </div>
            </React.Fragment>
        );
    }
}