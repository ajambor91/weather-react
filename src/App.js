import React from 'react';
import './App.css';
import WeatherComponent from './components/weatherComponent/weatherComponent'
import CitySelectionComponent from './components/citySelectionComponent/citySelectionComponent';
import SwitchButtonComponent from './components/switchButtonComponent/switchButtonComponent';
import WeatherDescriptionComponent from './components/weatherDescriptionComponent/weatherDescriptionComponent';
import TemperatureComponent from './components/temperatureComponent/temperatureComponent';
class App extends React.Component{
  constructor(){
    super();
    this.api = 'http://adamjambor.pl/w-backend/index.php';
    this.state = {
      locationStr:'Warsaw, Poland',
      location:{
        city:'Warsaw',
        country:'Poland'
      },
      temperature:'',
      description:'',
      code:'',
      styles:{
        container:{
          backgroundImage:''
        }
      },
      unit:'f',
      selectedUnit:'c'

    }
  }
  switchUnit = (e)=>{
    let unit;
    if(typeof e !='string'){
      unit = e.target.dataset.unit.toLowerCase();
    }
    else{
      unit = e.toLowerCase();
    }
    this.setState(prevState=>{
      let temperature = this.state.temperature;
      if(prevState.unit != unit){
        if(unit == 'c'){
          temperature=((temperature-32)/1.8).toFixed(0);
        }else if(unit == 'f'){
          temperature =  ((temperature * 1.8)+32).toFixed(0);
        }
        return{
          temperature:temperature,
          unit:unit,
          selectedUnit:unit
        }
      }
    })
  }
  onChange = (e) =>{
    let locationStr = e.target.value;
    this.setState(prevState =>{
     
      let locationStripped = locationStr.replace(/ /g,'');
      let location = locationStripped.split(',');
      let locationObj = {
        city:location[0],
        country:location[1]
      };
      return{
        locationStr: locationStr,
        location:locationObj
      }  
    });
  }
  getData = () =>{
    fetch(this.api+ '?city='+ this.state.location.city + '&country=' + this.state.location.country)
    .then(resp => resp.json())
    .then(resp=>{
      if(resp.status === true){
          this.setState({
            description:resp.description,
            temperature:resp.temperature,
            code:resp.code,
            unit:'f'
          }, ()=>{
    
            if(this.state.sekelectedUnit != 'f' && this.state.selectedUnit != 'F'){
              this.switchUnit('C')
            }
            this.changeBackground();

          });
      }
    })
  }
  changeBackground = () =>{
      let code = this.state.code;
      let icon;
      if(code <=5 || code == 11 || code == 12 || code >= 37 && code <= 40 || code == 45 || code ==47){

        icon = 'rain';
      }
      else if(code >= 13 && code <=18 || code >=41 && code <= 43 || code == 46 ){
        icon = 'snow';
      }
      else if(code >=19 &&  code <=30){
        icon = 'cloud';
      }
      else if(code >=31 && code <=36){
        icon = 'sun';
      }

    this.setState(prevState=>{

      return{
        styles:{
          container:{
            backgroundImage:"url('/images/"+icon+".jpg')"
          }
        }
      }
    });
  }
  componentDidUpdate(prevProps, prevState){
    if(prevState.location != this.state.location){
      this.getData();
    }
  }
  componentDidMount(){
    this.getData();
  }
  render(){
    return(
      <div className='container' style={this.state.styles.container}>
        <div className='col'>
          <div className='header'>
            <WeatherComponent/>
          </div>
          <div className="city-selection">
            <CitySelectionComponent onChange={this.onChange.bind(this)}  location={this.state.locationStr} />
          </div>
          <div className='button-container'>
            <SwitchButtonComponent active={this.state.unit === 'c' ? true:false} unit="C" onClick={this.switchUnit.bind(this)} />
            <SwitchButtonComponent active={this.state.unit === 'f' ? true:false} unit="F" onClick={this.switchUnit.bind(this)} />
          </div>
        </div>
        <div className='col'>
          <div className="description">
            <WeatherDescriptionComponent description={this.state.description} />
            <TemperatureComponent temperature={this.state.temperature} />
          </div>
        </div>
      </div>
      )
  }

}

export default App;
