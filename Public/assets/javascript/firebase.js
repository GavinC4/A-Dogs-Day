// This is the JS file for the Firebase data

 // ========Initialize Firebase=========
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyD49RrODDV-8s26jY6GXLhVyOi1mcdeyHI",
    authDomain: "dogs-day.firebaseapp.com",
    databaseURL: "https://dogs-day.firebaseio.com",
    projectId: "dogs-day",
    storageBucket: "dogs-day.appspot.com",
    messagingSenderId: "532273527834"
  };
  firebase.initializeApp(config);

var database = firebase.database().ref().push();

  // Create a new GeoFire instance at the random Firebase location
  var geoFire = new GeoFire(database);
  
    /* Callback method from the geolocation API which receives the current user's location */
  var geolocationCallback = function(location) {
    var latitude = location.coords.latitude;
    var longitude = location.coords.longitude;
    log("Retrieved user's location: [" + latitude + ", " + longitude + "]");

    var username = "wesley";
    geoFire.set(username, [latitude, longitude]).then(function() {
      log("Current user " + username + "'s location has been added to GeoFire");

      // When the user disconnects from Firebase (e.g. closes the app, exits the browser),
      // remove their GeoFire entry
      firebaseRef.child(username).onDisconnect().remove();

      log("Added handler to remove user " + username + " from GeoFire when you leave this page.");
    }).catch(function(error) {
      log("Error adding user " + username + "'s location to GeoFire");
    });
  }