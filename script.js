var eventData = [];
var map;
setInterval(function () {
  $(".leftCol").css("background-image", "url()");
  $(".leftCol").css("background-color", "black");
}, 4000);

// modal test!
document.addEventListener("DOMContentLoaded", function () {
  var modal1 = document.querySelectorAll(".modal");
  var instances = M.Modal.init(modal1, {
    onOpenStart: function () {
      const index = $(this._openingTrigger).attr("data-event-index");
      const event = eventData[index];
      console.log(event);
      $("#modal-title").text(event.name + "\n");
      $("#modal-date").text(event.date + "\n");
      $("#modal-image").attr("src", event.img);
      $("#modal-info").text("");
      $("#modal-info").text(event.info + "\n");
      map.setCenter(
        new google.maps.LatLng(
          event.venue.location.coord.lat,
          event.venue.location.coord.lon
        )
      );
    },
  });
});

var elemsTap = document.querySelector(".tap-target");
var instancesTap = M.TapTarget.init(elemsTap, {});
instancesTap.open();

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
}

//Back-end code playground kicks in here:

$("#searchBtn").on("click", function (response) {
  response.preventDefault();
  const citypass = $("#searchbox").val(); //ID of the city entry box goes here.
  //const statepass = $("#statebox").val(); //ID of the state entry goes here. Generally appears to require full name, but also doens't seem to work 100%.
  //const daysout = $("#daysout").val(); //Time frame can go here, and we can use the moment.js functions to dynamically constrain the search.
  $("#city-name").text(citypass);
  $(".mainCol").css("display", "none");
  $(".rightCol").css("display", "block");
  cityPull(citypass);
});

function cityPull(cityname) {
  //This is the initial Weathermap call zone.
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
    $("#weatherSpan").html(temp.toFixed(0) + " F");
    const imageadd = $("<img>").appendTo($("#weatherSpan"));
    imageadd.attr("src", whicon);
    lat = response.coord.lat;
    lon = response.coord.lon;
    console.log(response);
    console.log(lat, lon);
    $("#cityHeader").text(cityname);
    //This is the Ticketmaster call zone.

    APIKey = "qdZu7Y7hMt3KGPxrdiPLP6B4TNiFoYZC"; //Our API key. Can handle about a thousand searches a day.
    const nowmoment = moment();
    console.log(nowmoment)
    const newEnd = moment(nowmoment).add(7, 'days');
    console.log("varDate:" + moment(newEnd).format("YYYY-MM-DD") + "T23:59:59Z");
    endDate = moment(newEnd).format("YYYY-MM-DD") + "T23:59:59Z"; //Format YYYY-MM-ddThh:mm:ssZ. Date set here is the last day included in the search. Hook moment.js to this to get a certain day from now, keep time as is.
    //For paramaters, this call takes lat, long, an end date for the search, and a radius in KM. Radius and end date are currently hardcoded.
    queryURL =
      "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&latlong=" +
      lat +
      "," +
      lon +
      "&endDateTime=" +
      endDate +
      "&radius=20" +
      "&apikey=" +
      APIKey;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(queryURL);
      console.log("Response", response);
      // clear out eventDate array
      eventData.length = 0;

      var listarray = [];
      $("#events-list").empty();
      if (response.page.totalElements == "0") {
        console.log("We tried to make an exception.")
        const errorEntryEl = $("<div>");
        $("#events-list").append(errorEntryEl, $("<h3>").text("Sorry!"), $("<p>").text("Nothing's Poppin in your area. Try again another day!"));
        console.log("We reached the end of the exception bit.")
      }
      for (let i = 0; i < response.page.totalElements; i++) {
        if (listarray.includes(response._embedded.events[i].name) !== true) {
          // Build event object for easier access to data
          const event = {
            id: response._embedded.events[i].id,
            info: response._embedded.events[i].info,
            name: response._embedded.events[i].name,
            date: response._embedded.events[i].dates.start.localDate,
            img: response._embedded.events[i].images[0].url,
            venue: {
              name: response._embedded.events[i]._embedded.venues[0].name,
              location: {
                coord: {
                  lat:
                    response._embedded.events[i]._embedded.venues[0].location
                      .latitude,
                  lon:
                    response._embedded.events[i]._embedded.venues[0].location
                      .longitude,
                },
                address:
                  response._embedded.events[i]._embedded.venues[0].address,
                city: response._embedded.events[i]._embedded.venues[0].city,
                state:
                  response._embedded.events[i]._embedded.venues[0].state.name,
                postalCode:
                  response._embedded.events[i]._embedded.venues[0].postalCode,
              },
            },
          };

          const $event = $("<div>").addClass("event");
          const $modalBtn = $("<a>")
            .attr("data-target", "modal1")
            .attr("data-event-index", i)
            .addClass("btn modal-trigger halfway-fab waves-effect waves-light")
            .append($('<i class="material-icons black-text">location_on</i>'));

          $event.append(
            $("<h3>").text(event.name),
            $("<p>").text(event.info),
            $modalBtn
          );
          $("#events-list").append($event);

          //This is the ID we will use to pull the detailed info later. Also useful to keep on the site proper.
          //Adds event to the list to avoid duplication
          listarray.push(event.name);
          //Plug in the render/loop function here with relevant info - FUNCTION
          eventData.push(event);
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

//This is more or less unncessary.
// function eventPull(eventid) {
//   //This is the second Ticketmaster call zone, this time for a specific event.
//   var APIKey = "qdZu7Y7hMt3KGPxrdiPLP6B4TNiFoYZC";
//   var queryURL =
//     "https://app.ticketmaster.com/discovery/v2/events/" +
//     eventid +
//     ".json?apikey=" +
//     APIKey;
//   var lat = 0;
//   var lon = 0;
//   var weatherDate = "";
//   console.log(queryURL);
//   $.ajax({
//     url: queryURL,
//     method: "GET",
//   }).then(function (response) {
//     console.log(response);
//     console.log(response.name); //The name of the event.
//     console.log(response.url); //The link to get tickets.
//     console.log(response.dates.status.code); //Event status - This lets us know if it's been cancelled/delayed.
//     console.log(response.images[0].url); //First event image
//     console.log(response._embedded.venues[0].address); //Street address
//     lat = response._embedded.venues[0].location.latitude; // This will be the lat/long for our second weather call.
//     lon = response._embedded.venues[0].location.longitude;

//     if (response.dates.start.noSpecificTime == true) {
//       console.log("N/A"); //Output this to the time spot.
//     } else {
//       var hour = response.dates.start.localTime.split(":")[0];
//       var minute = response.dates.start.localTime.split(":")[1];
//       if (hour > 12) {
//         hour = hour - 12 + ":" + minute + "PM";
//       } else {
//         hour = hour + ":" + minute + " AM";
//       }
//       console.log("Time: " + hour); //Event start time, translated to AM/PM
//     }
//     console.log("The date is" + response.dates.start.localDate); //Re-call may not be necessary.
//   });
// }

// function localWeather(eventLat, eventLon){
// //This is the second Weathermap call zone, for weather at the event location and day.
// APIKey = "c0708fd314d4abadfb6401261f72c41f";
// queryURL =
//   "https://api.openweathermap.org/data/2.5/onecall?lat=" +
//   eventLat +
//   "&lon=" +
//   eventLon +
//   "&units=imperial&appid=" +
//   APIKey;

// $.ajax({
//   url: queryURL,
//   method: "GET",
// }).then(function (response) {
//   const dayIndex = //this needs to be defined to work.
//   const whicon =
//     "http://openweathermap.org/img/w/" +
//     response.daily[dayIndex].weather[dayIndex].icon +
//     ".png"; //gets our weather icon
//   const temp = response.daily[dayIndex].temp.max;
//   console.log(response);
//   console.log(whicon);
//   console.log(temp.toFixed(0));
//   //clicked.find(".renderedWeather").html("<img src='" + whicon + "' alt=' Projected weather icon'>" + temp.toFixed(0) + "°F");
//   console.log("<img src='" + whicon + "' alt=' Projected weather icon'>" + temp.toFixed(0) + "°F");
//   return("<img src='" + whicon + "' alt=' Projected weather icon'>" + temp.toFixed(0) + "°F");

// });
// }

function swapMenu() {
  const className = $(".tap-target-wrapper");
  if (className.hasClass("open")) {
    className.removeClass("open");
  } else {
    className.addClass("open");
  }
}