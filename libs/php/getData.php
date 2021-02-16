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
    $rest_countries['name'] = $rc_decode['name'];
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
    // print_r($rest_countries);

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
    $exchange_rates['rate'] = $er_decode['conversion_rates']['GBP'];

    //GeoNames Routine
    $gn_url='http://api.geonames.org/wikipediaSearchJSON?q=' . $rest_countries['name'] . '&maxRows=3&username=samw93';

    $gn_ch = curl_init();
    curl_setopt($gn_ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($gn_ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($gn_ch, CURLOPT_URL, $gn_url);

    $gn_result = curl_exec($gn_ch);

    curl_close($gn_ch);

    $gn_decode = json_decode($gn_result,true);
    $geonames = null;
    $geonames['firstTitle'] = $gn_decode['geonames'][0]['title'];
    $geonames['firstWikiUrl'] = $gn_decode['geonames'][0]['wikipediaUrl'];
    $geonames['secondTitle'] = $gn_decode['geonames'][1]['title'];
    $geonames['secondWikiUrl'] = $gn_decode['geonames'][1]['wikipediaUrl'];
    $geonames['thirdTitle'] = $gn_decode['geonames'][2]['title'];
    $geonames['thirdWikiUrl'] = $gn_decode['geonames'][2]['wikipediaUrl'];

    //Timezone Routine
    $tz_url='https://timezone.abstractapi.com/v1/current_time?api_key=10f6a0ab29b841cca8ada144c04e152d&location=' . $rest_countries['capital'] . ',' . $rest_countries['name'];

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
    $news_url='https://newsapi.org/v2/everything?q=' . $rest_countries['name'] . '&language=en&apiKey=28a6da9206f946b78fe57038813fd730';

    $news_ch = curl_init();
    curl_setopt($news_ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($news_ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($news_ch, CURLOPT_URL, $news_url);

    $news_result = curl_exec($news_ch);

    curl_close($news_ch);

    $news_decode = json_decode($news_result,true);
    $news = null;
    $news['firstTitle'] = $news_decode['articles'][0]['title'];
    $news['firstDescription'] = $news_decode['articles'][0]['description'];
    $news['firstUrl'] = $news_decode['articles'][0]['url'];
    $news['secondTitle'] = $news_decode['articles'][1]['title'];
    $news['secondDescription'] = $news_decode['articles'][1]['description'];
    $news['secondUrl'] = $news_decode['articles'][1]['url'];
    $news['thirdTitle'] = $news_decode['articles'][2]['title'];
    $news['thirdDescription'] = $news_decode['articles'][2]['description'];
    $news['thirdUrl'] = $news_decode['articles'][2]['url'];

    //COVID-19 Routine
    $covid_ch = curl_init();

    curl_setopt_array($covid_ch, [
        CURLOPT_URL => "https://covid-19-data.p.rapidapi.com/country?name=" . $rest_countries['name'],
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

    //ISS Routine
    $iss_url='https://api.wheretheiss.at/v1/satellites/25544';

    $iss_ch = curl_init();
    curl_setopt($iss_ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($iss_ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($iss_ch, CURLOPT_URL, $iss_url);

    $iss_result = curl_exec($iss_ch);

    curl_close($iss_ch);

    $iss_decode = json_decode($iss_result,true);
    $iss = null;
    $iss['lat'] = $iss_decode['latitude'];
    $iss['lng'] = $iss_decode['longitude'];

    // Output
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['restCountries'] = $rest_countries;
    $output['openWeather'] = $open_weather;
    $output['exchangeRates'] = $exchange_rates;
    $output['geoNames'] = $geonames;
    $output['timezone'] = $timezone;
    $output['news'] = $news;
    $output['covid'] = $covid;
    $output['iss'] = $iss;
    
    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);
?>