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
    $rest_countries = null;
    $rest_countries['iso2'] = $rc_decode['alpha2Code'];
    $rest_countries['capital'] = $rc_decode['capital'];
    $rest_countries['region'] = $rc_decode['region'];
    $rest_countries['subregion'] = $rc_decode['subregion'];
    $rest_countries['lat'] = $rc_decode['latlng'][0];
    $rest_countries['lng'] = $rc_decode['latlng'][1];
    $rest_countries['population'] = $rc_decode['population'];
    $rest_countries['demonym'] = $rc_decode['demonym'];
    $rest_countries['area'] = $rc_decode['area'];
    $rest_countries['callCode'] = $rc_decode['callingCodes'][0];
    $rest_countries['timezone'] = $rc_decode['timezones'][0];
    $rest_countries['currency'] = $rc_decode['currencies'][0];
    $rest_countries['flag'] = $rc_decode['flag'];
    $rest_countries['webDomain'] = $rc_decode['topLevelDomain'][0];

    //OpenWeather Routine
    $ow_api_key = 'cdab949d45e6ad36e58acb23d320ef18';

    $ow_url='https://api.openweathermap.org/data/2.5/weather?lat=' . $rest_countries['lat'] . '&lon=' . $rest_countries['lng'] . '&units=metric&appid=' . $ow_api_key;

    $ow_ch = curl_init();
    curl_setopt($ow_ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ow_ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ow_ch, CURLOPT_URL, $ow_url);

    $ow_result = curl_exec($ow_ch);

    curl_close($ow_ch);

    $ow_decode = json_decode($ow_result,true);
    $open_weather = null;
    $open_weather['main'] = $ow_decode['weather'][0]['main'];
    $open_weather['description'] = $ow_decode['weather'][0]['description'];
    $open_weather['icon'] = 'http://openweathermap.org/img/wn/' . $ow_decode['weather'][0]['icon'] . '@2x.png';
    $open_weather['temp'] = $ow_decode['main']['temp'];
    $open_weather['feelsLike'] = $ow_decode['main']['feels_like'];
    $open_weather['min'] = $ow_decode['main']['temp_min'];
    $open_weather['max'] = $ow_decode['main']['temp_max'];
    $open_weather['pressure'] = $ow_decode['main']['pressure'];
    $open_weather['humidity'] = $ow_decode['main']['humidity'];
    $open_weather['windSpeed'] = $ow_decode['wind']['speed'];
    $open_weather['clouds'] = $ow_decode['clouds']['all'];

    //Exchange Rates Routine
    $er_url='https://v6.exchangerate-api.com/v6/0e25348ef7f09a5b28274858/latest/' . $rest_countries['currency']['code'];

    $er_ch = curl_init();
    curl_setopt($er_ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($er_ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($er_ch, CURLOPT_URL, $er_url);

    $er_result = curl_exec($er_ch);

    curl_close($er_ch);

    $er_decode = json_decode($er_result,true);
    $exchange_rates = null;
    if ($er_decode['result'] == "error") {
        $exchange_rates = "N/A";
    } else {
    $exchange_rates['rate'] = $er_decode['conversion_rates']['GBP'];
    }

    //GeoNames Country Info Routine
    $gn_url='http://api.geonames.org/countryInfoJSON?country=' . $rest_countries['iso2'] . '&maxRows=3&username=samw93';

    $gn_ch = curl_init();
    curl_setopt($gn_ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($gn_ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($gn_ch, CURLOPT_URL, $gn_url);

    $gn_result = curl_exec($gn_ch);

    curl_close($gn_ch);

    $gn_decode = json_decode($gn_result,true);
    $geonames_info = null;
    $geonames_info['name'] = $gn_decode['geonames'][0]['countryName'];
    $geonames_info['north'] = $gn_decode['geonames'][0]['north'];
    $geonames_info['south'] = $gn_decode['geonames'][0]['south'];
    $geonames_info['east'] = $gn_decode['geonames'][0]['east'];
    $geonames_info['west'] = $gn_decode['geonames'][0]['west'];
    
    // GeoNames Wiki Routine
    $gnw_url='http://api.geonames.org/wikipediaBoundingBoxJSON?north=' . $geonames_info['north'] . '&south=' . $geonames_info['south'] . '&east=' . $geonames_info['east'] . '&west=' . $geonames_info['west'] . '&username=samw93';

    $gnw_ch = curl_init();
    curl_setopt($gnw_ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($gnw_ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($gnw_ch, CURLOPT_URL, $gnw_url);

    $gnw_result = curl_exec($gnw_ch);

    curl_close($gnw_ch);

    $gnw_decode = json_decode($gnw_result,true);
    $geonames_wiki = null;
    $geonames_wiki['firstTitle'] = $gnw_decode['geonames'][0]['title'];
    $geonames_wiki['firstWikiUrl'] = $gnw_decode['geonames'][0]['wikipediaUrl'];
    $geonames_wiki['secondTitle'] = $gnw_decode['geonames'][1]['title'];
    $geonames_wiki['secondWikiUrl'] = $gnw_decode['geonames'][1]['wikipediaUrl'];
    $geonames_wiki['thirdTitle'] = $gnw_decode['geonames'][2]['title'];
    $geonames_wiki['thirdWikiUrl'] = $gnw_decode['geonames'][2]['wikipediaUrl'];

    //OpenCage Routine
    $oc_url='https://api.opencagedata.com/geocode/v1/json?q=' . $rest_countries['lat'] . ',' . $rest_countries['lng'] . '&key=c10468007be7424bb69d013e20efe738';

    $oc_ch = curl_init();
    curl_setopt($oc_ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($oc_ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($oc_ch, CURLOPT_URL, $oc_url);

    $oc_result = curl_exec($oc_ch);

    curl_close($oc_ch);

    $oc_decode = json_decode($oc_result,true);
    $openCage['smallDenom'] = $oc_decode['results'][0]['annotations']['currency']['smallest_denomination'];
    $openCage['subunit'] = $oc_decode['results'][0]['annotations']['currency']['subunit'];
    $openCage['subToUnit'] = $oc_decode['results'][0]['annotations']['currency']['subunit_to_unit'];
    $openCage['driveOn'] = $oc_decode['results'][0]['annotations']['roadinfo']['drive_on'];
    $openCage['speedIn'] = $oc_decode['results'][0]['annotations']['roadinfo']['speed_in'];
    // print_r($openCage);
    

    //Timezone Routine
    $tz_url='https://timezone.abstractapi.com/v1/current_time?api_key=10f6a0ab29b841cca8ada144c04e152d&location=' . $rest_countries['capital'] . ',' . $geonames_info['name'];

    $tz_ch = curl_init();
    curl_setopt($tz_ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($tz_ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($tz_ch, CURLOPT_URL, $tz_url);

    $tz_result = curl_exec($tz_ch);

    curl_close($tz_ch);

    $tz_decode = json_decode($tz_result,true);
    $timezone = null;
    $timezone['datetime'] = $tz_decode ['datetime'];

    //News Routine
    $news_url='https://newsapi.org/v2/top-headlines?country=' . $rest_countries['iso2'] . '&apiKey=28a6da9206f946b78fe57038813fd730';

    $news_ch = curl_init();
    curl_setopt($news_ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($news_ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($news_ch, CURLOPT_URL, $news_url);

    $news_result = curl_exec($news_ch);

    curl_close($news_ch);

    $news_decode = json_decode($news_result,true);
    $news = null;
    if ($news_decode['totalResults'] == 0) {
        $news = "N/A";
    } else {
    $news['firstTitle'] = $news_decode['articles'][0]['title'];
    $news['firstDescription'] = $news_decode['articles'][0]['description'];
    $news['firstUrl'] = $news_decode['articles'][0]['url'];
    $news['secondTitle'] = $news_decode['articles'][1]['title'];
    $news['secondDescription'] = $news_decode['articles'][1]['description'];
    $news['secondUrl'] = $news_decode['articles'][1]['url'];
    $news['thirdTitle'] = $news_decode['articles'][2]['title'];
    $news['thirdDescription'] = $news_decode['articles'][2]['description'];
    $news['thirdUrl'] = $news_decode['articles'][2]['url'];
    }

    //COVID-19 Routine
    $covid_ch = curl_init();

    curl_setopt_array($covid_ch, [
        CURLOPT_URL => "https://covid-19-data.p.rapidapi.com/country/code?code=" . $rest_countries['iso2'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => [
            "x-rapidapi-host: covid-19-data.p.rapidapi.com",
            "x-rapidapi-key: ee24dd5034msh9a2e078a6db28fdp1778c5jsn1d27ffeeae70"
        ],
    ]);

    $covid_result = curl_exec($covid_ch);

    curl_close($covid_ch);

    $covid_decode = json_decode($covid_result,true);
    $covid = null;
    $covid['confirmed'] = $covid_decode[0]['confirmed'];
    $covid['recovered'] = $covid_decode[0]['recovered'];
    $covid['critical'] = $covid_decode[0]['critical'];
    $covid['deaths'] = $covid_decode[0]['deaths'];

    // Get Country Border
    $geoJSON = json_decode(file_get_contents("../json/countryBorders.geo.json"), true);
    $geoJsonCountries = $geoJSON['features'];
    $countryBorder = null;

    foreach($geoJsonCountries as $country){
        if($country['properties']['iso_a2'] == $rest_countries['iso2']){
            $countryBorder = $country['geometry'];
        break;
        }
    }

    // Output
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['restCountries'] = $rest_countries;
    $output['openWeather'] = $open_weather;
    $output['exchangeRates'] = $exchange_rates;
    $output['geoNames']['info'] = $geonames_info;
    $output['geoNames']['wiki'] = $geonames_wiki;
    $output['openCage'] = $openCage;
    $output['timezone'] = $timezone;
    $output['news'] = $news;
    $output['covid'] = $covid;
    $output['border'] = $countryBorder;
    
    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode($output);
?>