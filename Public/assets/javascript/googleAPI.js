// ========Initialize Firebase=========

var config = {
    apiKey: "AIzaSyD49RrODDV-8s26jY6GXLhVyOi1mcdeyHI",
    authDomain: "dogs-day.firebaseapp.com",
    databaseURL: "https://dogs-day.firebaseio.com",
    projectId: "dogs-day",
    storageBucket: "dogs-day.appspot.com",
    messagingSenderId: "532273527834"
  };
  firebase.initializeApp(config);

var dbQuery = firebase.database();

var cardId = [];

var imgURL = [];

getData();

function getData() {

	//change ref per depending if it's bars or restaurants
	var query = dbQuery.ref('restaurants');

	query.once("value")
        .then(function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				cardId.push(childSnapshot.val().id);
			});
		});
    console.log(cardId);
}

// ======== GOOGLE API AJAX FUNCTION===========
// googlePlacesPull();
// var petStores = [];

var placeId = [];

var photoReference = [];

function googlePlacesPull() {
	// Add the GOOGLE QUERY SEARCH url 
	// Starting with Pet Store search
	// var searchParam = "pet_store"; 
	// var searchParam = "veterinary_care";
	// This current search will only yeild 19 results. Use the next_page_token to get more results
	// for (i=0; i < 5; i++){
		//bars - 40
        var queryURL= "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=30.2672,-97.7431&radius=50000&keyword=" + cardId[40] + "&key=AIzaSyAnP96C4pRrqEGJA-GxmQYr2pJaFb9lYfU"

		// Ajax call that pulls the data from the api
		$.ajax({
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type':'application/x-www-form-urlencoded'
				},
			url: queryURL,
			method: 'GET'
		})
		.done(function(response) {
		// Logs entire response
		console.log("This is the GOOGLE place response: " + JSON.stringify(response));

		//Sets the variable results = the entire data set coming from the API
		var data = response.results[0];

		console.log(data);
		console.log(data.photos[0].photo_reference);

		var imgURL = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + data.photos[0].photo_reference + "&key=AIzaSyAnP96C4pRrqEGJA-GxmQYr2pJaFb9lYfU";

		console.log("IMG URL:" + imgURL);

		dbQuery.ref('restaurants').child(cardId[39]).child('image').set(imgURL);

		})
		.error(function(error) {
	       	console.log(error);
		 });
}