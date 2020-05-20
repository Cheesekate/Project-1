// modal test!
document.addEventListener("DOMContentLoaded", function () {
  var modal1 = document.querySelectorAll(".modal");
  var instances = M.Modal.init(modal1);
});

//Back-end code playground kicks in here:

$("#searchBtn").on("click", function (response) {
  response.preventDefault();
  const citypass = $("#searchbox").val(); //ID of the city entry box goes here.
  //const statepass = $("#statebox").val(); //ID of the state entry goes here. Generally appears to require full name, but also doens't seem to work 100%.
  var lat = 0;
  var lon = 0;
  cityPull(citypass);
});

function cityPull(cityname) {
  //This is the initial Weathermap call zone.
  var city = cityname;
  var APIKey = "c0708fd314d4abadfb6401261f72c41f";
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityname +
    "&units=imperial&appid=" +
    APIKey;
  //var queryURL ="https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&" + cityState + "&units=imperial&appid=" + APIKey;
  var lat = 0;
  var lon = 0;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    const whicon =
      "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png"; //gets our weather icon
    const temp = response.main.temp;
    lat = response.coord.lat;
    lon = response.coord.lon;
    console.log(response);
    console.log(lat, lon);
    //this pastes the icon tag and temperature readout straight into a text tag by ID.
    console.log(whicon);
    console.log(temp);
    //$("#cityWeather").html("<img src='" + whicon + "' alt=' Projected weather icon'>" + temp.toFixed(0) + "°F");

    //This is the Ticketmaster call zone.

    APIKey = "qdZu7Y7hMt3KGPxrdiPLP6B4TNiFoYZC"; //Our API key. Can handle about a thousand searches a day.
    endDate = "2020-05-20T23:59:59Z"; //Format YYYY-MM-ddThh:mm:ssZ. Date set here is the last day included in the search. Hook moment.js to this to get a certain day from now, keep time as is.
    //For paramaters, this call takes lat, long, an end date for the search, and a radius in KM. Radius and end date are currently hardcoded.
    queryURL =
      "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&lat=" +
      lat +
      "&long=" +
      lon +
      "&endDateTime=" +
      endDate +
      "&radius=200" +
      "&apikey=" +
      APIKey;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      var listarray = [];
      console.log(listarray);
      for (let i = 0; i < response.page.size; i++) {
        if (listarray.includes(response._embedded.events[i].name) != true) {
          console.log(response._embedded.events[i].name); //Name of event
          console.log(response._embedded.events[0].dates.start.localDate); //Date of event;
          console.log(response._embedded.events[i].images[0].url); //First image
          console.log(response._embedded.events[i]._embedded.venues[0].name); //Name of venue
          console.log(
            response._embedded.events[i]._embedded.venues[0].address,
            response._embedded.events[i]._embedded.venues[0].city,
            response._embedded.events[0]._embedded.venues[0].state.name,
            response._embedded.events[i]._embedded.venues[0].postalCode
          ); //street address, city, state, zip
          console.log(response._embedded.events[i].id); //This is the ID we will use to pull the detailed info later. Also useful to keep on the site proper.
          listarray.push(response._embedded.events[i].name); //Adds event to the list to avoid duplication
          //Plug in the render/loop function here with relevant info - FUNCTION
        } else {
          console.log("dupe"); //Lets us know a duplicate event name was skipped.
        }
      }
    });
  });
}

$(".renderedTitle").on("click", function (response) {
  response.preventDefault();
  var clicked = $(this);
  const eventpass = $(this).find(".renderedID").text(); //div of the city entry box goes here, with the appropriate ID within.
  var lat = 0;
  var lon = 0;
  //eventPull(eventpass);
});

function eventPull(eventid) {
  //This is the second Ticketmaster call zone, this time for a specific event.
  var APIKey = "qdZu7Y7hMt3KGPxrdiPLP6B4TNiFoYZC";
  var queryURL =
    "https://app.ticketmaster.com/discovery/v2/events/" +
    eventid +
    ".json?apikey=" +
    APIKey;
  var lat = 0;
  var lon = 0;
  var weatherDate = "";
  console.log(queryURL);
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    console.log(response.url); //The link to get tickets.
    console.log(response.dates.status.code); //Event status - This lets us know if it's been cancelled/delayed.
    console.log(response.images[0].url); //First event image
    console.log(response._embedded.venues[0].address); //Street address
    lat = response._embedded.venues[0].location.latitude; // This will be the lat/long for our second weather call.
    lon = response._embedded.venues[0].location.longitude;

    if (response.dates.start.noSpecificTime == true) {
      console.log("N/A"); //Output this to the time spot.
    } else {
      var hour = response.dates.start.localTime.split(":")[0];
      var minute = response.dates.start.localTime.split(":")[1];
      if (hour > 12) {
        hour = hour - 12 + ":" + minute + "PM";
      } else {
        hour = hour + ":" + minute + " AM";
      }
      console.log("Time: " + hour); //Event start time, translated to AM/PM
    }
    console.log(response.dates.start.localDate); //Re-call may not be necessary.

    //This is the second Weathermap call zone, for weather at the event location and day.
    APIKey = "c0708fd314d4abadfb6401261f72c41f";
    queryURL =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&units=imperial&appid=" +
      APIKey;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      const dayIndex = dayDifference - 1;
      const whicon =
        "http://openweathermap.org/img/w/" +
        response.daily[dayIndex].weather[dayIndex].icon +
        ".png"; //gets our weather icon
      const temp = response.daily[dayIndex].temp.max;
      console.log(response);
      console.log(whicon);
      console.log(temp.toFixed(0));
      //clicked.find(".renderedWeather").html("<img src='" + whicon + "' alt=' Projected weather icon'>" + temp.toFixed(0) + "°F");
    });
  });
}
