// Display loader until page is ready
$(window).on("load", function () {
  $("#loader-container").hide();
  $("#loader").hide();
});

// Retrieve users location on load
$(document).ready(() => {
  const successCallback = (position) => {
    userLat = position.coords.latitude;
    userLng = position.coords.longitude;
    L.marker([userLat, userLng], {
      icon: userIcon,
    }).addTo(mymap);
    mymap.panTo([userLat, userLng]);

    $.ajax({
      url: "libs/php/userCountryInfo.php",
      type: "POST",
      dataType: "json",
      data: {
        lat: userLat,
        lng: userLng,
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
          $(".currencyName").html(result["restCountries"]["currency"]["name"]);
          $(".subunit").html(result["openCage"]["subunit"]);
          $(".smallDenom").html(result["openCage"]["smallDenom"]);
          $(".subToUnit").html(result["openCage"]["subToUnit"]);
          $(".currencySymbol").html(
            result["restCountries"]["currency"]["symbol"]
          );
          $(".currencyCode").html(result["restCountries"]["currency"]["code"]);
          $(".exchangeRate").html();
          if (result.exchangeRates != "N/A") {
            $(".exchangeRate").html(
              `1 ${result["restCountries"]["currency"]["name"]} = ${result["exchangeRates"]["rate"]} British pound`
            );
          } else {
            $(".exchangeRate").html(
              "No exchange rate information available at this time"
            );
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
            $(".firstNewsTitle").html(" ");
            $(".firstNewsDescription").html("No news available at this time");
            $(".secondNewsTitle").html(" ");
            $(".secondNewsDescription").html(" ");
            $(".thirdNewsTitle").html(" ");
            $(".thirdNewsDescription").html(" ");
          } else {
            $(".firstNewsUrl").attr("href", result["news"]["firstUrl"]);
            $(".firstNewsTitle").html(result["news"]["firstTitle"]);
            $(".firstNewsDescription").html(result["news"]["firstDescription"]);
            $(".secondNewsUrl").attr("href", result["news"]["secondUrl"]);
            $(".secondNewsTitle").html(result["news"]["secondTitle"]);
            $(".secondNewsDescription").html(
              result["news"]["secondDescription"]
            );
            $(".thirdNewsUrl").attr("href", result["news"]["thirdUrl"]);
            $(".thirdNewsTitle").html(result["news"]["thirdTitle"]);
            $(".thirdNewsDescription").html(result["news"]["thirdDescription"]);
          }

          // COVID-19 Info
          $(".confirmed").html(result["covid"]["confirmed"]);
          $(".recovered").html(result["covid"]["recovered"]);
          $(".deaths").html(result["covid"]["deaths"]);
          $(".critical").html(result["covid"]["critical"]);

          if (mymap.hasLayer(border)) {
            mymap.removeLayer(border);
          }

          border = L.geoJSON(result["border"], {
            style: function (feature) {
              return { color: "#D93838" };
            },
          }).addTo(mymap);
          mymap.fitBounds(border.getBounds());
          $("#loader-container").hide();
          $("#loader").hide();
        }
      },
      error: function (request, status, error) {
        console.log(error);
        $("#loader-container").hide();
        $("#loader").hide();
      },
    });
  };

  const errorCallback = (error) => {
    console.log("Unable to retrieve your location");

    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
    }
  };

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
    enableHighAccuracy: true,
  });
});

// Map tiles & Overlays
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
var Thunderforest_MobileAtlas = L.tileLayer(
  "https://{s}.tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png?apikey={apikey}",
  {
    attribution:
      '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    apikey: "3bfafd83922741d79a4c36f18e1bdfe8",
    maxZoom: 22,
  }
);

var Jawg_Streets = L.tileLayer(
  "https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token={accessToken}",
  {
    attribution:
      '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 0,
    maxZoom: 22,
    subdomains: "abcd",
    accessToken:
      "35K3OEa1eVgfR0CPWGqsYVFMHuwPDEbyiDg9m7bj9WBpuLhjJJuHfdpKvCtYpcn4",
  }
);

var issIcon = L.icon({
  iconUrl: "./libs/images/iss.png",
  iconSize: [100, 50],
  iconAnchor: [50, 25],
});

var userIcon = L.icon({
  iconUrl: "./libs/images/user-marker.png",
  iconSize: [50, 50],
  iconAnchor: [25, 25],
});

// Create map
var mymap = L.map("mapid", {
  center: [0, 0],
  zoom: 3,
  layers: [OpenStreetMap_Mapnik],
});

var baseMaps = {
  "Streets Map": OpenStreetMap_Mapnik,
  Sunny: Jawg_Streets,
  Dark: Stadia_AlidadeSmoothDark,
  "Mobile Atlas": Thunderforest_MobileAtlas,
  "World Imagery": Esri_WorldImagery,
  Watercolor: Stamen_Watercolor,
};

var mapOverlays = {
  "World Imagery Overlay": Stamen_TonerHybrid,
  "Railways Overlay": OpenRailwayMap,
  "Hiking Trails": WaymarkedTrails_hiking,
  "Cycling Trails": WaymarkedTrails_cycling,
};

L.control.layers(baseMaps, mapOverlays).addTo(mymap);

var border;
var issLocation;
var userLat;
var userLng;

//EasyButtons
L.easyButton(
  "<i class='fas fa-info-circle'></i>",
  function () {
    $("#countryInfo").modal("toggle");
  },
  "Country Information"
).addTo(mymap);

L.easyButton(
  "<i class='fas fa-pound-sign'></i>",
  function () {
    $("#currencyInfo").modal("toggle");
  },
  "Currency Information"
).addTo(mymap);

L.easyButton(
  "<i class='fas fa-cloud-sun-rain'></i>",
  function () {
    $("#weatherInfo").modal("toggle");
  },
  "Weather Information"
).addTo(mymap);

L.easyButton(
  "<i class='fas fa-newspaper'></i>",
  function () {
    $("#latestNews").modal("toggle");
  },
  "Latest News"
).addTo(mymap);

L.easyButton(
  "<i class='fas fa-virus'></i>",
  function () {
    $("#covid19").modal("toggle");
  },
  "COVID-19 Information"
).addTo(mymap);

L.easyButton(
  "<i class='fas fa-satellite'></i>",
  function () {
    $.ajax({
      url: "libs/php/findISS.php",
      type: "POST",
      dataType: "json",
      success: function (result) {
        if (issLocation) {
          mymap.removeLayer(issLocation);
        }

        issLocation = L.marker([result.iss.lat, result.iss.lng], {
          icon: issIcon,
        })
          .bindPopup("Current location of the International Space Station")
          .openPopup()
          .addTo(mymap);

        mymap.panTo([result.iss.lat, result.iss.lng]);
      },
      error: function (request, status, error) {
        console.log(error);
      },
    });
  },
  "Track ISS"
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

// Run getData.php and populate info tables
$("#selectCountry").change(function () {
  $("#loader-container").show();
  $("#loader").show();
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
        $(".currencyName").html(result["restCountries"]["currency"]["name"]);
        $(".subunit").html(result["openCage"]["subunit"]);
        $(".smallDenom").html(result["openCage"]["smallDenom"]);
        $(".subToUnit").html(result["openCage"]["subToUnit"]);
        $(".currencySymbol").html(
          result["restCountries"]["currency"]["symbol"]
        );
        $(".currencyCode").html(result["restCountries"]["currency"]["code"]);
        $(".exchangeRate").html();
        if (result.exchangeRates != "N/A") {
          $(".exchangeRate").html(
            `1 ${result["restCountries"]["currency"]["name"]} = ${result["exchangeRates"]["rate"]} British pound`
          );
        } else {
          $(".exchangeRate").html(
            "No exchange rate information available at this time"
          );
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
          $(".firstNewsTitle").html(" ");
          $(".firstNewsDescription").html("No news available at this time");
          $(".secondNewsTitle").html(" ");
          $(".secondNewsDescription").html(" ");
          $(".thirdNewsTitle").html(" ");
          $(".thirdNewsDescription").html(" ");
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

        if (mymap.hasLayer(border)) {
          mymap.removeLayer(border);
        }

        border = L.geoJSON(result["border"], {
          style: function (feature) {
            return { color: "#D93838" };
          },
        }).addTo(mymap);
        mymap.fitBounds(border.getBounds());
        $("#loader-container").hide();
        $("#loader").hide();
      }
    },
    error: function (request, status, error) {
      console.log(error);
      $("#loader-container").hide();
      $("#loader").hide();
    },
  });
});
