
<<<<<<< HEAD


=======
  
  
>>>>>>> c17f85f90460d06d1eba88c504656eed88ea3538
//Back-end code playground kicks in here:

var APIKey = "qdZu7Y7hMt3KGPxrdiPLP6B4TNiFoYZC";
var cityName = "Phoenix";
var todayDate = "2020-05-20T23:59:59Z"; //this is going to change a bit, thinking midnight day after?
//var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&city=" + cityName + "&endDateTime=" + todayDate + "&radius=200" + "&apikey=" + APIKey
var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&lat=" + exampleLat + "&long=" + exampleLong + "&endDateTime=" + todayDate + "&radius=200" + "&apikey=" + APIKey
var exampleLat = "33.4582"
var exampleLong = "-112.0691"


// $.ajax({
//     url: queryURL,
//     method: "GET",
//   }).then(function (response) {
//     console.log(response);
// });