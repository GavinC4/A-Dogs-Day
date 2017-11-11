// // jQuery onclick for 4 options =============================================================================
// $("#activity").click(function() {
//     console.log("got to activity on click**************");
//     var selection = $(this).attr("class");
//     switch(selection){
//         case "restarurant":
//             console.log("got to restaurant ==========================");
//             restaurant(); 
//             break;
//         case "bar":
//             console.log("got to bar ==========================");
//             bar(); 
//             break;
//         case "park":
//             console.log("got to park ==========================");
//             park(); 
//             break;
//         case "shop":
//             console.log("got to shop ==========================");
//             shop(); 
//             break;
//         default:
//             console.log("************ GOT THROUGH SWITCH WITH NOTHING ****************");
//     }
// });

var yelp = require('yelp-fusion');
var token = "zlKJOEnGtMvJJtzuev9tdRldt7r1O4fKDKA7P6FiTbh3maMv19xJJSzeCm6D-hBiGWfLKe-wtIjtr7Sn_1iQG49Kz46XStBf9B3XgqzE0UYuK_8LEjvqZ9XxsZEDWnYx";
var client = yelp.client(token);

// RESTAURANT - DOG FRIENDLY =================================================================================
var restaurant = function() {

    var locationArray = [];

    // console.log("###### RESTAURANT ######")
    // console.log("========================")

    client.search({
      term:'dog friendly',
      location: 'orlando, fl', // update with current location
      categories: "restaurants"
    }).then(response => {

        var res = response.jsonBody.businesses;

        for (var i = 0; i < 1; i++) {

            // console.log(res[i]);
            // console.log("=======================================================");

            locationArray.push(res[i].name, res[i].image_url, res[i].location.display_address, res[i].display_phone, res[i].coordinates);

        }

        console.log("**********************");
        console.log(locationArray);
        console.log("**********************");

        // module.exports = locationArray;

    }).catch(err => {
        console.log(err);
    });
}

restaurant();



// var yelp = require('yelp-fusion');
// var token = "zlKJOEnGtMvJJtzuev9tdRldt7r1O4fKDKA7P6FiTbh3maMv19xJJSzeCm6D-hBiGWfLKe-wtIjtr7Sn_1iQG49Kz46XStBf9B3XgqzE0UYuK_8LEjvqZ9XxsZEDWnYx";
// var client = yelp.client(token);

// BAR - DOG FRIENDLY ===================================================================
// var bar = function() {

//     console.log("###### BARS ######")
//     console.log("==================")
     
//     client.search({
//       term:"dog friendly",
//       location: "orlando, fl", // update with current location
//       categories: "bars"
//     }).then(response => {

//         var res = response.jsonBody.businesses;

//         for (var i = 0; i < 4; i++) {

//             console.log(res[i].name);
//             console.log(res[i].coordinates);
//             console.log("=======================================================");

//         }

//     }).catch(e => {

//         console.log(e);

//     });

// };

// var yelp = require('yelp-fusion');
// var token = "zlKJOEnGtMvJJtzuev9tdRldt7r1O4fKDKA7P6FiTbh3maMv19xJJSzeCm6D-hBiGWfLKe-wtIjtr7Sn_1iQG49Kz46XStBf9B3XgqzE0UYuK_8LEjvqZ9XxsZEDWnYx";
// var client = yelp.client(token);

// PARKS ===================================================================
// var park = function() {

//     console.log("###### PARKS ######")
//     console.log("==================")
     
//     client.search({
//       location: 'orlando, fl', // update with current location
//       categories: "dog_parks"
//     }).then(response => {

//         var res = response.jsonBody.businesses;

//         for (var i = 0; i < 4; i++) {

//             console.log(res[i].name);
//             console.log(res[i].coordinates);
//             console.log("=======================================================");

//         }

//     }).catch(e => {

//         console.log(e);

//     });

// };

// var yelp = require('yelp-fusion');
// var token = "zlKJOEnGtMvJJtzuev9tdRldt7r1O4fKDKA7P6FiTbh3maMv19xJJSzeCm6D-hBiGWfLKe-wtIjtr7Sn_1iQG49Kz46XStBf9B3XgqzE0UYuK_8LEjvqZ9XxsZEDWnYx";
// var client = yelp.client(token);
 
// STORE - DOG ===================================================================
// var store = function() {

//     console.log("###### STORE ######")
//     console.log("========================")

//     client.search({
//       term:'pet store',
//       location: 'orlando, fl', // update with current location
//       // categories: "shopping"
//     }).then(response => {

//         var res = response.jsonBody.businesses;

//         for (var i = 0; i < 4; i++) {

//             console.log(res[i].name);
//             console.log(res[i].coordinates);
//             console.log("=======================================================");

//         }

//     }).catch(e => {

//         console.log(e);

//     });

// };



// USED TO EXTRACT TOKEN - ONLY NEEDED FOR INITIAL SETUP ===========================================================
// 'use strict';
 
// var yelp = require('yelp-fusion');

// var clientId = "_soJC5AUUZsfY7jOQIedfQ";
// var clientSecret = "nFVcvJpk8ejoOEaYPCEyDKizuETImgncdb1TYUozGIjt3jLGbHv0QZaGaVJQ4Zom";
 
// var token = yelp.accessToken(clientId, clientSecret).then(response => {
//   console.log(response.jsonBody.access_token);
// }).catch(e => {
//   console.log(e);
// });