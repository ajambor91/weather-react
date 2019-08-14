import React from 'react';
import './switchButtonComponent.css'; 
class SwitchButtonComponent extends React.Component{
    render(){
        return(
            <button className={this.props.active ? 'active' : ''} data-unit={this.props.unit} onClick={this.props.onClick}>{this.props.unit}</button>
        )
    }
}
export default SwitchButtonComponent;