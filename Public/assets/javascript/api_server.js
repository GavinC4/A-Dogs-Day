//  ======= YELP API NODE CALL ===============
// Request API access: http://www.yelp.com/developers/getting_started/api_access

var Yelp = require('yelp');
var config = require('./config/config.json');
var firebase = require('firebase');

// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyD49RrODDV-8s26jY6GXLhVyOi1mcdeyHI",
    authDomain: "dogs-day.firebaseapp.com",
    databaseURL: "https://dogs-day.firebaseio.com",
    projectId: "dogs-day",
    storageBucket: "dogs-day.appspot.com",
    messagingSenderId: "532273527834"
};

firebase.initializeApp(config);

var database = firebase.database();

var yelp = new Yelp({
  consumer_key: config.consumerKey,
  consumer_secret: config.consumerSecret,
  token: config.token,
  token_secret: config.tokenSecret
});

var OrlandoZipcodes = [];

for (var k = 0; k < OrlandoZipcodes.length; k++){
	var zipcode = OrlandoZipcodes[k];

	for (var j = 0; j < 50; j++){
		//See http://www.yelp.com/developers/documentation/v2/search_api
		yelp.search({ term: 'bars dogs allowed', location: zipcode, limit: j})
		.then(function (data) {
			console.log(data);
			var results = data.businesses;


			for (var i = 0; i < results.length; i++){

		 		var name = results[i].name;
		        var image = results[i].snippet_image_url;
		  		var lat = results[i].location.coordinate.latitude;
		  		var lng = results[i].location.coordinate.longitude;
		  		var address = results[i].location.display_address["0"] + ", ATX";
		  		var phone = results[i].display_phone;
		  		var yelpURL = results[i].url;
		  		var id = results[i].id;

		  		console.log(results);

				database.ref('bars/' + id).set({
					id: id,
					name: name,
					image: image,
					loc:{
						lat: lat,
						lng: lng},
					address: address,
					phone: phone,
					url: yelpURL
				});
		  }

		})
		.catch(function (err) {
		  console.error(err);
		});
 	}
}
