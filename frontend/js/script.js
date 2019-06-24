class Header extends React.Component{
    render(){
        return (
            <h1>Sprawdzenie pogody</h1>
        )
    }
}

class UnitShift extends React.Component{
    render(){
        return(
            <button style={{color: this.props.active ? (this.props.color): ('grey')}} data-unit={this.props.unit} onClick={this.props.onClick} className="button">{this.props.name}</button>
        )
    }    
}

class App extends React.Component{
    constructor(){
        super();       
        this.Url = 'backend/ApiWheather.php?';
        this.LocationApi = 'backend/ApiLocation.php?';
        this.state = {
            geoLocale : false,
            unit: 'f',
            selectedUnit:'',
            temperature:'',
            description:'',
            code:'',
            loader:true,
            locationStr:'Warsaw, Poland',
            location:{
                city:'Warsaw',
                country:'Poland'
            },
            coords:{
                latitude:'',
                longitude:''
            },
            styles:{
                input:{
                    width:''
                },
                background:{
                    backgroundImage:''
                }

            }
           
            
    
        }
    }
     changeColor = () =>{
       this.setState(prevState=>{
            let code = this.state.code;
            let color;
            let icon;
            if(code <=5 || code == 12 || code >= 37 && code <= 40 || code == 45 || code ==47){
            
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
            return{
                styles:{
                    background:{
                        backgroundImage:"url('frontend/images/"+icon+".jpg')"
                    }
                }
            }    
       });
    }
    getCityFromCoords = () =>{
            fetch(this.LocationApi+'lat=' + this.state.coords.latitude + '&long=' + this.state.coords.longitude)
            .then(resp=>resp.json())
            .then(resp =>{
                this.setState(prevState =>{
                    let city = resp.city;
                    let country = resp.country;
                    return{
                        location:{
                            city:city,
                            country:country
                        },
                        locationStr:city+', '+country
                    }
                });
            }); 
        
    }
    getData = () =>{
        this.setState(prevProps=>{
            return{
                loader:true
            }
        });
        fetch(this.Url+'city=' + this.state.location.city +'&country='+ this.state.location.country)
            .then(resp=>resp.json()) 
            .then(resp => {
                this.setState(prevState => {
                    if (resp.status == true ){
                        let temperature = resp.temperature;
                        let code = resp.code;
                        let description = resp.description;
                        let unit = 'f';
                        return {
                            temperature:temperature,
                            description:description,
                            code:code,
                            unit:unit,
                            loader:false
                      
                        
                        }}
                    else{
                        return {
               
                            temperature:false,
                            description:false
                        }
                    }},()=>{
                        this.changeColor();
                        let selectedUnit = this.state.selectedUnit;
                        if(selectedUnit != 'f'){
                            this.switchUnit('c');
                        }                       
                        
                    });    

            })
            .catch(resp=>{
               this.setState(prevState=>{
                return {
 
                    temperature:false,
                    description:false
                }
               }); 
            });
      
    }
    selectCity = (e) =>{
        let location = e.target.value;
        let splitLocation = location.replace(/ /g,'');
        splitLocation = splitLocation.split(',');
        let locationObj = {
            city:splitLocation[0],
            country:splitLocation[1]
        }
        
        this.setState( prevState =>{
                return{
                    location:locationObj,
                    locationStr:location
                }
            });
    };  
  
    geolacationCity = () =>{
        let getPosition = (position) =>{
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;

                this.setState(resp=>{
                    return{
                        geoLocale:true,
                        coords:{
                            latitude:latitude,
                            longitude:longitude
                        }
                    }
                });
            
        }
        if(navigator.geolocation){
           navigator.geolocation.getCurrentPosition(getPosition);
        }
    }
    inputSize = () =>{
        this.setState(prevState=>{
            let inputValue = this.state.location.value;
            let inputSize =(inputValue.lenght * 12.8).toFixed(0);
            return{
                loader:true,
                styles:{
                    input:{
                        width: inputSize+'px'
                    }
                }
            }
        });
    }
    switchUnit = (e) =>{
        let unit;
        if(typeof e !='string' ){
            unit = e.target.dataset.unit.toLowerCase();
        }
        else{
            unit = e.toLocaleLowerCase();
        }
        this.setState(prevState=>{
            if(prevState.unit != unit){
                let temperature = this.state.temperature;
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
    componentDidUpdate(prevProps, prevState){
    
        if(prevState.locationStr != this.state.locationStr){
            this.getData();
        }
      
        if(this.state.geoLocale === true){
            // this.getCityFromCoords(); 
        }
     

    }
    componentDidMount(){
        this.getData();
        this.geolacationCity();
        

    }
    render(){
        return(
           <div className='container-fluid'>
               <div className='header pt-5 position-absolute px-2'>
                   <h1 className='h1'>Wheather</h1>
                    <p>In city: <CitySelection location={this.state.locationStr} style={this.state.styles.input} onChange={this.selectCity.bind(this)} /></p>
                    <div className='unit-switcher-container'>
                        <SwitchButton active={(this.state.unit == 'f') ? true:false} switchUnit={this.switchUnit.bind(this)} unit='F' unitName='Fahrenheit' />
                        <SwitchButton active={(this.state.unit == 'c') ? true:false} switchUnit={this.switchUnit.bind(this)} unit='C' unitName='Celsius' />
                    </div>
               </div>
                {this.state.loader ? 
                (<Loader />) :
                (<div className='row wheather-background pt-5 px-2' style={this.state.styles.background}>
                         <div className='col-12'>
                            <ul className='list-group'>
                                <li><WheaterDescription description={this.state.description} /></li>
                                <li><Temperature temperature={this.state.temperature}/></li>
                            </ul>
                        </div>
                    </div>
                )}    
           </div>
        )
    }
}
class SwitchButton extends React.Component{
    render(){
        return(
            <button className='unit-switcher' style={{backgroundColor: this.props.active ? 'rgba(255,255,255,0.3' : ''}} onClick={this.props.switchUnit} data-unit={this.props.unit}>{this.props.unitName}</button>
        )
    }
}
class Loader extends React.Component{
    render(){
        return(
            <div className='loader position-relative'>
                <img className='d-block position-absolute loader' src='frontend/images/loader.gif'></img>
            </div>
        )    
    }
}
class WheaterDescription extends React.Component{
    render(){
        return(
            <p className='wheather-description'>{this.props.description}</p>  
        )
    }
}
class Temperature extends React.Component{

    
    render(){
        return(
            <p id='round' className='temperature'>Temperature: {this.props.temperature} <sup className='unit-char'>{(this.props.unit == 'c') ? ('C') : ('F')}&deg;</sup></p>
        )
    }
}
class CitySelection extends React.Component{
    
    render(){
        return (
            <div className='input'>
                <input className='m-auto' value={this.props.location} style={this.props.style} type="text" onChange={this.props.onChange}></input>
            </div>
        )
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('app')
  );
