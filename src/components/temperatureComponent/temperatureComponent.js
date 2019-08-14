import React from 'react';
import './temperatureComponent.css';
class TemperatureComponent extends React.Component{
    render(){
        return(
            <div>
                <span className="temperature">{this.props.temperature}&deg;</span>
            </div>
        )
    }
}
export default TemperatureComponent;