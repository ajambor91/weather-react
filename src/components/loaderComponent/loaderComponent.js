import React from 'react';
import './loaderComponent.css';
class LoaderComponent extends React.Component{
    render(){
        return(
            <div className="loader-container">
                <div className="loader">
                    <img src='/images/loader.gif'></img>
                </div>
            </div>
        )
    }
}
export default LoaderComponent;