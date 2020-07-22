<?php

// https://www.kerstner.at/2015/02/enabling-cross-origin-resource-sharing-cors-for-php/
$allowedOrigins = array(
  '(http(s)://)?(www\.)?webbouwer\.org',
  '(http(s)://)?webbouwer\.github\.io',
  '(http(s)://)?(www\.)?webdesigndenhaag\.net'
);

if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] != '') {
  foreach ($allowedOrigins as $allowedOrigin) {
    if (preg_match('#' . $allowedOrigin . '#', $_SERVER['HTTP_ORIGIN'])) {
      header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
      header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
      header('Access-Control-Max-Age: 1000');
      header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
      break;
    }
  }
}

/*
//header('Access-Control-Allow-Origin: https://webbouwer.org);
//https://stackoverflow.com/questions/8719276/cross-origin-request-headerscors-with-php-headers
$d = $_SERVER['HTTP_ORIGIN']; // request from domain
$a = array( "https://webbouwer.org", "https://webbouwer.github.io", "http://www.webdesigndenhaag.net" );
if( in_array( $d, $a){
    header("Access-Control-Allow-Origin: $d");
}
*/

header('Content-Type: application/json');

if( $_GET['url'] ){

$data = file_get_contents($_GET['url']);
echo $data; // array : print_r( preg_split("/[\s,]+/", $data) ); //echo print_r( json_decode($data, true) );

/*
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $_GET['url'] );
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$data = curl_exec($ch);
curl_close($ch);
echo $data;
*/

}else{
    // no file
    echo 'add ?url=<your url>';
}

?>
