// Display loader until page is ready
$(window).on("load", function () {
  $("#loader-container").hide();
  $("#loader").hide();
});

$(document).ready(() => {
  const successCallback = (position) => {
    userLatLng = `${position.coords.latitude}, ${position.coords.longitude}`;
    console.log(userLatLng);
  };

  const errorCallback = (error) => {
    console.error(error);
  };

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
});

// Map tiles
var Esri_WorldImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);
var OpenStreetMap_Mapnik = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
);
var Stadia_AlidadeSmoothDark = L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
  {
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
  }
);
var Stadia_Outdoors = L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png",
  {
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
  }
);
var Stamen_Watercolor = L.tileLayer(
  "https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}",
  {
    attribution:
      'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abcd",
    minZoom: 1,
    maxZoom: 16,
    ext: "jpg",
  }
);
var OpenRailwayMap = L.tileLayer(
  "https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://www.OpenRailwayMap.org">OpenRailwayMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  }
);
var Stamen_TonerHybrid = L.tileLayer(
  "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-hybrid/{z}/{x}/{y}{r}.{ext}",
  {
    attribution:
      'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abcd",
    minZoom: 0,
    maxZoom: 20,
    ext: "png",
  }
);
var WaymarkedTrails_hiking = L.tileLayer(
  "https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png",
  {
    maxZoom: 18,
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://waymarkedtrails.org">waymarkedtrails.org</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  }
);
var WaymarkedTrails_cycling = L.tileLayer(
  "https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png",
  {
    maxZoom: 18,
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://waymarkedtrails.org">waymarkedtrails.org</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  }
);

// Create map
var mymap = L.map("mapid", {
  center: [0, 0],
  zoom: 3,
  layers: [
    Esri_WorldImagery,
    OpenStreetMap_Mapnik,
    Stadia_AlidadeSmoothDark,
    Stamen_Watercolor,
    Stamen_TonerHybrid,
  ],
});

var baseMaps = {
  "Streets Map": OpenStreetMap_Mapnik,
  Dark: Stadia_AlidadeSmoothDark,
  Watercolor: Stamen_Watercolor,
  "World Imagery": Esri_WorldImagery,
};

var mapOverlays = {
  "Railways Overlay": OpenRailwayMap,
  "World Imagery Overlay": Stamen_TonerHybrid,
  "Hiking Trails": WaymarkedTrails_hiking,
  "Cycling Trails": WaymarkedTrails_cycling,
};

L.control.layers(baseMaps, mapOverlays).addTo(mymap);

//EasyButtons
L.easyButton(
  "<i class='bi bi-info-circle'></i>",
  function () {
    $("#countryInfo").modal("toggle");
  },
  "Country Information"
).addTo(mymap);

L.easyButton(
  "<i class='bi bi-cash'></i>",
  function () {
    $("#currencyInfo").modal("toggle");
  },
  "Currency Information"
).addTo(mymap);

L.easyButton(
  "<i class='bi bi-brightness-high'></i>",
  function () {
    $("#weatherInfo").modal("toggle");
  },
  "Weather Information"
).addTo(mymap);

L.easyButton(
  "<i class='bi bi-newspaper'></i>",
  function () {
    $("#latestNews").modal("toggle");
  },
  "Latest News"
).addTo(mymap);

L.easyButton(
  "<i class='bi bi-x-circle'></i>",
  function () {
    $("#covid19").modal("toggle");
  },
  "COVID-19 Information"
).addTo(mymap);

// Populate select field
$.ajax({
  url: "libs/php/populateSelect.php",
  type: "POST",
  dataType: "json",
  success: function (result) {
    $.each(result.data, function (index) {
      $("#selectCountry").append(
        $("<option>", {
          value: result.data[index].iso3,
          text: result.data[index].name,
        })
      );
    });
  },
  error: function (request, status, error) {
    console.log(error);
  },
});

// Apply country border to map
$("#selectCountry").change(function () {
  $.ajax({
    url: "libs/php/getCountryBorders.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      if (
        $("#selectCountry").val() ==
        result["data"]["features"][0]["properties"]["iso_a3"]
      ) {
        L.geoJSON(result["data"], {
          style: function (feature) {
            return { color: "#000" };
          },
        }).addTo(mymap);
      }
    },
    error: function (request, status, error) {
      console.log(error);
    },
  });
});

// Run getData.php and populate info tables
$("#selectCountry").change(function () {
  $.ajax({
    url: "libs/php/getData.php",
    type: "POST",
    dataType: "json",
    data: {
      code: $("#selectCountry").val(),
    },
    success: function (result) {
      console.log(result);

      if (result.status.name == "ok") {
        // Country Info
        $(".countryFlag").attr("src", result["restCountries"]["flag"]);
        $(".countryFlag").attr(
          "alt",
          result["geoNames"]["info"]["name"] + " flag"
        );
        $(".countryName").html(result["geoNames"]["info"]["name"]);
        $(".region").html(
          result["restCountries"]["region"] +
            " | " +
            result["restCountries"]["subregion"]
        );
        $(".area").html(
          Number(result["restCountries"]["area"]).toLocaleString("en") +
            " km<sup>2</sup>"
        );
        $(".population").html(
          Number(result["restCountries"]["population"]).toLocaleString("en")
        );
        $(".demonym").html(result["restCountries"]["demonym"]);
        $(".capital").html(result["restCountries"]["capital"]);
        $(".timezone").html(result["restCountries"]["timezone"]);
        $(".datetime").html(result["timezone"]["datetime"]);
        $(".coordinates").html(
          result["restCountries"]["lat"] +
            " / " +
            result["restCountries"]["lng"]
        );
        $(".callCode").html("+" + result["restCountries"]["callCode"]);
        $(".driveOn").html(
          "The " + result["openCage"]["driveOn"] + " side of the road"
        );
        $(".speedIn").html(result["openCage"]["speedIn"]);
        $(".webDomain").html(result["restCountries"]["webDomain"]);
        $(".firstWikiUrl").attr(
          "href",
          result["geoNames"]["wiki"]["firstWikiUrl"]
        );
        $(".secondWikiUrl").attr(
          "href",
          result["geoNames"]["wiki"]["secondWikiUrl"]
        );
        $(".thirdWikiUrl").attr(
          "href",
          result["geoNames"]["wiki"]["thirdWikiUrl"]
        );
        $(".firstWikiTitle").html(result["geoNames"]["wiki"]["firstTitle"]);
        $(".secondWikiTitle").html(result["geoNames"]["wiki"]["secondTitle"]);
        $(".thirdWikiTitle").html(result["geoNames"]["wiki"]["thirdTitle"]);

        // Currency Info
        if (result.exchangeRates != "N/A") {
          $(".currencyName").html(result["restCountries"]["currency"]["name"]);
          $(".subunit").html(result["openCage"]["subunit"]);
          $(".smallDenom").html(result["openCage"]["smallDenom"]);
          $(".subToUnit").html(result["openCage"]["subToUnit"]);
          $(".currencySymbol").html(
            result["restCountries"]["currency"]["symbol"]
          );
          $(".currencyCode").html(result["restCountries"]["currency"]["code"]);
          $(".exchangeRate").html(result["exchangeRates"]["rate"]);
        } else {
          $(".currencyName").html(result["restCountries"]["currency"]["name"]);
          $(".subunit").html(result["openCage"]["subunit"]);
          $(".smallDenom").html(result["openCage"]["smallDenom"]);
          $(".subToUnit").html(result["openCage"]["subToUnit"]);
          $(".currencySymbol").html(
            result["restCountries"]["currency"]["symbol"]
          );
          $(".currencyCode").html(result["restCountries"]["currency"]["code"]);
          $(".exchangeRate").html(result["exchangeRates"]["rate"]);
          $(".noCurrency").html("No exchange rate available at this time.");
        }

        // Weather Info
        $(".icon").attr("src", result["openWeather"]["icon"]);
        $(".main").html(result["openWeather"]["main"]);
        $(".description").html(result["openWeather"]["description"]);
        $(".temp").html(result["openWeather"]["temp"] + "&deg;C");
        $(".feelsLike").html(result["openWeather"]["feelsLike"] + "&deg;C");
        $(".max").html(result["openWeather"]["max"] + "&deg;C");
        $(".min").html(result["openWeather"]["min"] + "&deg;C");
        $(".humidity").html(result["openWeather"]["humidity"] + "%");
        $(".clouds").html(result["openWeather"]["clouds"] + "%");
        $(".windSpeed").html(result["openWeather"]["windSpeed"] + " m/s");
        $(".pressure").html(result["openWeather"]["pressure"] + " hPa");

        // Latest News
        if (result.news == "N/A") {
          $(".noNews").html("NO NEWS AVAILABLE AT THIS TIME.");
        } else {
          $(".firstNewsUrl").attr("href", result["news"]["firstUrl"]);
          $(".firstNewsTitle").html(result["news"]["firstTitle"]);
          $(".firstNewsDescription").html(result["news"]["firstDescription"]);
          $(".secondNewsUrl").attr("href", result["news"]["secondUrl"]);
          $(".secondNewsTitle").html(result["news"]["secondTitle"]);
          $(".secondNewsDescription").html(result["news"]["secondDescription"]);
          $(".thirdNewsUrl").attr("href", result["news"]["thirdUrl"]);
          $(".thirdNewsTitle").html(result["news"]["thirdTitle"]);
          $(".thirdNewsDescription").html(result["news"]["thirdDescription"]);
        }

        // COVID-19 Info
        $(".confirmed").html(result["covid"]["confirmed"]);
        $(".recovered").html(result["covid"]["recovered"]);
        $(".deaths").html(result["covid"]["deaths"]);
        $(".critical").html(result["covid"]["critical"]);
      }
    },
    error: function (request, status, error) {
      console.log(error);
    },
  });
});
