<?php

class ApiLocation
{
    private $coords;
 
    const API_URL = 'https://api.opencagedata.com/geocode/v1/';
    const AppKey = 'a2bef511475e4ceb9c87906393b59f96';
    const Format = 'json';
    const Method = 'GET';
    public function __construct($lat, $long)
    {
        $this->setCoords($lat,$long);

    
    }

    public function getCoords()
    {
        return $this->coords;
    }
    public function setCoords($lat, $long)
    {

 
        $this->coords = $lat.'+'.$long;
     

        return $this;
    }
    public function getLocation()
    {
      
        $options = array(
            CURLOPT_HEADER => false,
            CURLOPT_URL => self::API_URL.self::Format .'?q='. $this->getCoords().'&key='.self::AppKey,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false
        );

        $ch = curl_init();
        curl_setopt_array($ch, $options);
        $response = curl_exec($ch);
        curl_close($ch);
        
        $returnData = json_decode($response);   
        echo json_encode(['status'=>true, 'country' => $returnData->results[0]->components->country, 'city' =>$returnData->results[0]->components->town]);

    }
}
 
 
try {
    $location = new ApiLocation($_GET['lat'],$_GET['long']);
    $location->getLocation();
 
} catch (Exception $e) {
    echo $e;
}
