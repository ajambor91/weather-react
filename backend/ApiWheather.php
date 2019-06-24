<?php

class ApiWheather
{
    private $params = [];
    private $oAuth = [];
    const API_URL = 'https://weather-ydn-yql.media.yahoo.com/forecastrss';
    const AppId = 'lwH4bW32';
    const ConsumerKey = 'dj0yJmk9dkZ2NXJYQ1hiWTUzJmQ9WVdrOWJIZElOR0pYTXpJbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTVj';
    const SecretKey = '164668f9f61461ece9ff947308a8235553d8b44f';
    const Format = 'json';
    const Method = 'GET';
    public function __construct($city, $country)
    {
        $this->setParams($city,$country);

        $this->setOAuth();
    }
    public function getOAuth(){
        return $this->oAuth;
    }
    public function getParams()
    {
        return $this->params;
    }
    public function setOAuth(){
        $this->oAuth = [
            'oauth_consumer_key' => self::ConsumerKey,
            'oauth_nonce' => uniqid(mt_rand(1, 1000)),
            'oauth_signature_method' => 'HMAC-SHA1',
            'oauth_timestamp' => time(),
            'oauth_version' => '1.0'
        ];
        return $this;
    }
    public function setParams($city, $country)
    {

        $this->params = [
            'location' =>$city.','.$country,
            'format' => self::Format
        ];

        return $this;
    }

    public function buildAuthorizationHeader() {
        $result = 'Authorization: OAuth ';
        $values = array();
        foreach($this->getOAuth() as $key=>$value) {
            $values[] = "$key=\"" . rawurlencode($value) . "\"";
        }
        $result .= implode(', ', $values);
        return $result;
    }
    public function buildBase(){
        $result = [];
        $params = array_merge($this->getParams(), $this->getOAuth());
        ksort($params);
        foreach($params as $key => $value) {
            $result[] = "$key=" . rawurlencode($value);
        }

        return self::Method . "&" . rawurlencode(self::API_URL) ."&". rawurlencode(implode('&', $result));
    }
    public function getWheather()
    {
        $baseInfo = $this->buildBase();
        $compositeKey = rawurlencode(self::SecretKey).'&';
        $oauthSignature = base64_encode(hash_hmac('sha1', $baseInfo, $compositeKey, true));
        $this->oAuth['oauth_signature'] = $oauthSignature;
        $header = array(
            $this->buildAuthorizationHeader($this->getOAuth()),
            'X-Yahoo-App-Id: ' . self::AppId
        );

        $options = array(
            CURLOPT_HTTPHEADER => $header,
            CURLOPT_HEADER => false,
            CURLOPT_URL => self::API_URL . '?' . http_build_query($this->getParams()),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false
        );

        $ch = curl_init();
        curl_setopt_array($ch, $options);
        $response = curl_exec($ch);
        curl_close($ch);
        
        $returnData = json_decode($response);
        $description = $returnData->current_observation->condition->text;
        $temperature = $returnData->current_observation->condition->temperature;
        $code = $returnData->current_observation->condition->code;
        if (($code != '' && $code != null) && ($temperature != null && $temperature != '') && ($description != null && $description !='' ))
        echo json_encode(['status'=>true, 'description' => $description, 'temperature'=>$temperature,'code'=>$code]);
        else{
        echo json_decode(['status'=>false]);

        }
    }
}
 
 
try {
    $wheather = new ApiWheather($_GET['city'],$_GET['country']);
    $wheather->getWheather();
 
} catch (Exception $e) {
    echo $e;
}
