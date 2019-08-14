import React from 'react';
import './citySelectionComponent.css';
class CitySelectionComponent extends React.Component{
    constructor(){
        super();
        this.span = React.createRef();
        this.state = {
            style:{
                width:''
            }
        }
    }
    resizeInput = () => {

        let width = this.span.current.offsetWidth;
        this.setState({
            style:{
                width:width + 'px'
            }
        });
    }
    componentDidMount(){
        this.resizeInput();
    }
    componentDidUpdate(prevProps,prevState){
        if(prevProps.location != this.props.location){
            this.resizeInput();
        }
    }
    render(){
        return(
            <React.Fragment>
                <input style={this.state.style} name="weather" value={this.props.location} onChange={this.props.onChange}></input>
                <span className='hidden-span' ref={this.span}>{this.props.location}</span>
            </React.Fragment>
        )
    }
}
export default CitySelectionComponent;