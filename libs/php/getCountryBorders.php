<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);
    ini_set('memory_limit', '1024M');

    $executionStartTime = microtime(true);

    $countryData = json_decode(file_get_contents("../json/countryBorders.geo.json"), true);

     $output['status']['code'] = "200";
     $output['status']['name'] = "ok";
     $output['status']['description'] = "success";
     $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
     $output['data'] = $countryData;
 
     header('Content-Type: application/json; charset=UTF-8');

     echo json_encode($output);

?>