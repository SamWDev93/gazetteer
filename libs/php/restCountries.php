<?php
    //RESTCounties Routine
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);
    ini_set('memory_limit', '1024M');

    $executionStartTime = microtime(true);

    $rc_url='https://restcountries.eu/rest/v2/alpha/' . $_REQUEST['code'];

	$rc_ch = curl_init();
    curl_setopt($rc_ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($rc_ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($rc_ch, CURLOPT_URL, $rc_url);

	$rc_result = curl_exec($rc_ch);

	curl_close($rc_ch);

    $rc_decode = json_decode($rc_result,true);
    
    $rc_output['status']['code'] = "200";
    $rc_output['status']['name'] = "ok";
    $rc_output['status']['description'] = "success";
    $rc_output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $rc_output['data'] = $rc_decode;
    
    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($rc_output);

    //OpenWeather Routine
    $ow_api_key = 'cdab949d45e6ad36e58acb23d320ef18';

    $ow_url='https://api.openweathermap.org/data/2.5/onecall?lat=' . $rc_output['latlng'][0] . '&lon=' . $rc_output['latlng'][1] . '&exclude=hourly,minutely&units=metric&appid=' . $ow_api_key;

    $ow_ch = curl_init();
    curl_setopt($ow_ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ow_ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ow_ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ow_ch, CURLOPT_URL, $ow_url);

    $ow_result = curl_exec($ow_ch);

    curl_close($ow_ch);

    $ow_decode = json_decode($ow_result,true);

    $ow_output['status']['code'] = "200";
    $ow_output['status']['name'] = "ok";
    $ow_output['status']['description'] = "success";
    $ow_output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $ow_output['data'] = $ow_decode;
    
    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($ow_output);

?>
