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
  const citypass = $("#searchbox").val(); //ID of the city entry box goes here.
  const statepass = $("#statebox").val(); //ID of the state entry goes here. Generally appears to require full name, but also doens't seem to work 100%.
  var lat = 0;
  var lon = 0;
  cityPull(citypass);
  });
  
  function cityPull(cityname, cityState){
      //This is the initial Weathermap call zone.
      var city = cityname;
      var APIKey = "c0708fd314d4abadfb6401261f72c41f";
      var queryURL ="https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&" + cityState + "&units=imperial&appid=" + APIKey;
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
      
      //This is the Ticketmaster call zone.
      
      APIKey = "qdZu7Y7hMt3KGPxrdiPLP6B4TNiFoYZC"; //Our API key. Can handle about a thousand searches a day.
      endDate = "2020-05-20T23:59:59Z"; //Format YYYY-MM-ddThh:mm:ssZ. Date set here is the last day included in the search. Hook moment.js to this to get a certain day from now, keep time as is.
      //For paramaters, this call takes lat, long, an end date for the search, and a radius in KM. Radius and end date are currently hardcoded.
      queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&lat=" + lat + "&long=" + lon + "&endDateTime=" + endDate + "&radius=200" + "&apikey=" + APIKey
      
      $.ajax({
          url: queryURL,
          method: "GET",
        }).then(function (response) {
          console.log(response);
          var listarray = [];
          console.log(listarray);
          for (let i = 0; i < response.page.size; i++) {
              if (listarray.includes(response._embedded.events[i].name) != true){
              console.log(response._embedded.events[i].name); //Name of event
              console.log(response._embedded.events[i].images[0].url); //First image
              console.log(response._embedded.events[i]._embedded.venues[0].name) //Name of venue
              console.log(response._embedded.events[i]._embedded.venues[0].address, response._embedded.events[i]._embedded.venues[0].city, response._embedded.events[0]._embedded.venues[0].state.name, response._embedded.events[i]._embedded.venues[0].postalCode) //street address, city, state, zip
              listarray.push(response._embedded.events[i].name); //Adds event to the list to avoid duplication
              }
              else{
                  console.log("dupe"); //Lets us know a duplicate event name was skipped.
              }
          }
  
      });
      
  });
  
  }
  