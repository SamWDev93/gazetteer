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

// Create map
var mymap = L.map("mapid").setView([0, 0], 2);

// Map tiles
var Esri_WorldImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
).addTo(mymap);
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
          Number(result["restCountries"]["area"]).toLocaleString("en")
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
      }
    },
    error: function (request, status, error) {
      console.log(error);
    },
  });
});
