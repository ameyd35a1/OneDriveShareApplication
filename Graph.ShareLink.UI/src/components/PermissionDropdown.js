import React from 'react';
import { ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

class PermissionDropdown extends React.Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.actions = [{ id: 1, name: 'Read' }, { id: 2, name: 'Write' }];
        this.state = {
            dropDownValue: props.value,
            dropdownOpen: false
        };
    }

    toggle(event) {

        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    changeValue(e) {
        this.setState({ dropDownValue: e.currentTarget.textContent });
        let id = e.currentTarget.getAttribute("id");
        this.props.onChange(e.currentTarget.innerHTML);
    }


    componentDidMount() {
    }

    render() {
        return (
            <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret>
                    {this.state.dropDownValue}
                </DropdownToggle>
                <DropdownMenu>
                    {this.actions.map(e => {
                        return <DropdownItem id={e.id} key={e.id} onClick={this.changeValue}>{e.name}</DropdownItem>
                    })}
                </DropdownMenu>
            </ButtonDropdown>
        );
    }

}

export default PermissionDropdown;