<?php
if($_GET['url']){
//https://raw.githubusercontent.com/webbouwer/wp-plugin-bundle/master/README.md
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $_GET['url'] );
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$data = curl_exec($ch);
curl_close($ch);

//echo $data;
$list = print_r( preg_split("/[\s,]+/", $data) );

}else{
    // no file
    echo 'add ?url=<your url>';
}
?>
