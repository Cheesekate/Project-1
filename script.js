$(function() {
    $(window).scroll(function() {
      var winTop = $(window).scrollTop();
      if (winTop >= 30) {
        $("body").addClass("sticky-shrinknav-wrapper");
      } else{
        $("body").removeClass("sticky-shrinknav-wrapper");
      }
    });
  });
  
  
//Back-end code playground kicks in here:

$("#searchBtn").on("click", function (response){
  response.preventDefault();
  const citypass = $("#searchbox").val();
  cityPull(citypass);
  });
  
  function cityPull(cityname){
  
      var APIKey = "c0708fd314d4abadfb6401261f72c41f";
      var queryURL ="https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=" + APIKey;
      var lat = 0;
      var lon = 0;
  
      $.ajax({
      url: queryURL,
      method: "GET",
      }).then(function (response) {
      const whicon = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png"; //gets our weather icon
      const temp = response.main.temp;
      lat = response.coord.lat;
      lon = response.coord.lon;
      console.log(response);
      console.log(lat, lon);
      //this pastes the icon tag and temperature readout straight into a text tag by ID. 
      $("#cityWeather").html("<img src='" + whicon + "' alt=' Projected weather icon'>" + temp.toFixed(0) + "°F");
      
  
  });
      
  }