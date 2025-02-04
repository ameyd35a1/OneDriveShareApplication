﻿import React from 'react';
import '../static/styles/switch.scss';

const Switch = ({ isOn, handleToggle, onColor }) => {
    return (
        <React.Fragment>
            <input
                checked={isOn}
                onChange={handleToggle}
                className="react-switch-checkbox"
                id={`react-switch-new`}
                type="checkbox"
            />
            <label
                style={{background: isOn && onColor}}
                className="react-switch-label"
                htmlFor={`react-switch-new`}
            >
                <span className={`react-switch-button`} />
            </label>
        </React.Fragment>
    );
};

export default Switch;