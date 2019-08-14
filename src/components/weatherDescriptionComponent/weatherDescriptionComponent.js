import React from 'react';
import './weatherDescriptionComponent.css';
class WeatherDescription extends React.Component{
    render(){
        return(
            <div className="weather-description">
                <span>{this.props.description}</span>
            </div>
        )
    }
}
export default WeatherDescription;