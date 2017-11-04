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

// Intiliaze variable for database push
var databasePush = firebase.database().ref().push();
// Initialize variable for any database querying
var dbQuery = firebase.database();
// Global variables of pos (which is the user location and username in order to retrieve later)
var pos;
// Because our map is at a zoom of 13 which is 2 miles, 2 miles in km is 3.21869 Km / 2 = 1.609345
// Will use this radius to determine what results are populated into the map and cards (only this <= this radiu)
var resultRadius = 5; // distance in miles or our user location
// var resultsArray = [];
var map;
var locationMarkers = [];

var marker;


// ================ FUNCTIONS =================

function initMap() {
    var styles = [{
        "featureType": "all",
        "elementType": "labels",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#8ac440"
        }]
    }, {
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [{
            "visibility": "on"
        }]
    }, {
        "featureType": "road.arterial",
        "elementType": "labels.text",
        "stylers": [{
            "visibility": "on"
        }]
    }, {
        "featureType": "road.local",
        "elementType": "labels.text",
        "stylers": [{
            "visibility": "on"
        }]
    }, {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#2196F3"
        }]
    }];
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });
    var infoWindow = new google.maps.InfoWindow();

    // The default marker color
    var defaultIcon = makeMarkerIcon('0091ff');
    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            console.log("This is the user's location: [" + pos.lat + ", " + pos.lng + "]");
            // Setting the coordinates of user in local storage
            localStorage.setItem("userLocation", JSON.stringify(pos));
            // creates the user location marker
            var myMarker = new google.maps.Marker({
                map: map,
                position: pos,
                title: 'You and your Dog are Here!',
                animation: google.maps.Animation.DROP,
                icon: defaultIcon,

            });

            // event listener that displays a popup window when mousing over and changes the color
            myMarker.addListener('mouseover', function() {
                populateInfoWindow(this, infoWindow);
                this.setIcon(highlightedIcon);
            });

            // event listener that changes the color when mouseout
            myMarker.addListener('mouseout', function() {
                this.setIcon(defaultIcon);
            });

            infoWindow.setPosition(pos);

            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
};
// google.maps.event.addDomListener(window, 'load', initMap);

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
};

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
    }
};

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
};

// This creates the dog icon for each spot
function makeDogIcon(imageId) {
    // for (var i = 0; i < locationMarkers.length; i++) {
    var markerDogImage = new google.maps.MarkerImage(
        "assets/img/" + imageId + ".png",
        new google.maps.Size(30, 38),
        new google.maps.Point(0, 0),
        new google.maps.Point(15, 38),
        new google.maps.Size(30, 38));
    return markerDogImage;
    locationMarkers[i].setIcon(dogIcon.icon);
    // }
};

// Haversine function that calculates the distance between to coordinates with the result in miles
function getDistanceInKm(lat2, lng2) {
    var userLocation = JSON.parse(localStorage.getItem("userLocation", pos));
    // console.log("This is the ARRAY user location: " + userLocation);
    var lat1 = userLocation.lat;
    var lng1 = userLocation.lng;
    var R = 3959; // Radius of the earth in miles
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLng = deg2rad(lng2 - lng1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = R * c; // Distance in km
    return distance;
};

function deg2rad(degrees) {
    return degrees * (Math.PI / 180);

};

function showMarkers() {
    // var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < locationMarkers.length; i++) {
        locationMarkers[i].setMap(map);
        // bounds.extend(locationMarkers[i].position);
        makeDogIcon(category);
    }
    // We might have an issue with this because if there is only one closeby it zooms really far in
    // map.fitBounds(bounds);
};

// This function will loop through the listings and hide them all and empty the array location markers.
function hideMarkers() {
    // Put this within an if statement to run only when there is 
    // information within the array
    for (var i = 0; i < locationMarkers.length; i++) {
        locationMarkers[i].setMap(null);
    }
    locationMarkers = [];
};

// Maybe put all of this in an document on ready function
// This will handle the user click in the dropdown
$('.categories a').on('click', getData);

// initializing variables
var card;
var category;
var markerPosition;

// function to get the user click and pull the data
function getData() {
    hideMarkers();
    $('#cardsAppearHere').empty();
    // moves the user window to the map section when the user makes a selection
    window.location.hash = "yourMap";
    var category = $(this).data('category');
    console.log("User Click: " + category);

    // Loop through the information in the database
    var query = dbQuery.ref($(this).data('category'));
    // Tie this query to the user click data-category "bars" for example
    query.once("value")
        .then(function(snapshot) {
            // snapshot.forEach(function(childSnapshot) {
            var venues = snapshot.val();    
            for(venue in venues){    
                // key will be the item the first time and the second item the second time
                var childData = venues[venue];
                // var key = childSnapshot.key;
                // child lat and lng will be the actual contents of the child loc
                // var childData = childSnapshot.val();

                var lat2 = childData.loc.lat;
                var lng2 = childData.loc.lng;
                var distance = getDistanceInKm(lat2, lng2);
                // console.log("This is the distance from user location to bar: " + distance);
                //if logic to take the bar child if the radius is <= to result Radius and display on the page it if is
                if (distance <= resultRadius) {
                    // console.log("This is ID of the " + category + " closest to you: " + JSON.stringify(childSnapshot.val().id));
                    // console.log("This is the " + category + " closest to you: " + JSON.stringify(childSnapshot.val()));
                    // console.log("------------------------------");

                    // ======== MAP MARKER CREATION AND PUSH ========

                    var dogIcon = makeDogIcon(category);

                    markerPosition = childData.loc;
                    var markerTitle = childData.name;
                    var markerId = childData.id;
                    marker = {};
                    marker = new google.maps.Marker({
                        map: map,
                        position: markerPosition,
                        title: markerTitle,
                        animation: google.maps.Animation.DROP,
                        // icon: defaultIcon,
                        id: markerId,
                        icon: dogIcon
                    });
                    // Push the marker to our array of markers.
                    locationMarkers.push(marker);
                    // console.log("Maraker: " + JSON.stringify(locationMarkers));
                    // marker.setMap(map);
                    marker.addListener('click', function() {
                        window.location.href = "#" + $(this)[0].id;
                        console.log("This is the CardId: " + $(this)[0].id);
                    });

                    // listeners to display and hide the title of the spot on mouseover and mouseout
                    // ====== TO DO ==============
                    // marker.addListener('mouseover', function() {
                    //     populateInfoWindow(this, largeInfowindow);
                    // });
                    // marker.addListener('mouseout', function() {
                    //     closeInfoWindow(this, largeInfowindow);
                    // });

                    // ======= END MARKER CREATION ===========

                    // ======= TEMPLATE CREATION ============== 

                    var cardImgURL = childData.image;
                    var cardName = childData.name;
                    var cardDistance = distance.toFixed(2);
                    var cardAddress = childData.address;
                    var cardPhone = childData.phone;
                    var cardYelpURL = childData.url;
                    var cardId = childData.id;

                    card = {
                        cardId: cardId,
                        cardImgURL: cardImgURL,
                        cardName: cardName,
                        cardDistance: cardDistance,
                        cardAddress: cardAddress,
                        cardPhone: cardPhone,
                        cardYelpURL: cardYelpURL
                    }

                    // console.log("This should print all info in card: " + card);

                    // Targeting the underscore template housed in the html
                    var cardsTemplate = _.template($('#cardsResults').html());
                    //$('#cardsAppearHere').append(cardsTemplate({card: card}));
                    $('#cardsAppearHere').append(cardsTemplate(card));
                    console.log(cardsTemplate);
                    // ======= END TEMPLATE CREATION ============== 
  
                } else {
                    // console.log("This bar is not close to you");
                }

            };    

        })
        // the function showmarkers is fired after the entire for each loop is running and done pulling out appropriate categories
        // .then(function() {
        //     // showMarkers();
        // });
        
};

