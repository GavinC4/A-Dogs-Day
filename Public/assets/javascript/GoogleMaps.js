var yelpArray = require("./yelp.js");

console.log("===================");
console.log(yelpArray);
console.log("===================");

var map, infoWindow;
      function initMap() {

        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 28.538, lng: -81.379},
          zoom: 7
        });

        infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('My Location');
            infoWindow.open(map);
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }

        // var yelpArray = [ 

        //   'Market On South',
        //   'https://s3-media1.fl.yelpcdn.com/bphoto/dZFQLJ5LVIrh5VYdo2wvNw/o.jpg',
        //   { latitude: 28.5389212616, longitude: -81.3493730127811 },
        //   [ '2603 E South St', 'Orlando, FL 32803' ],
        //   '(407) 613-5968'

        // ];



        var contentString1 = 
        '<div id="content">'+
          '<div id="bodyContent">'+
            '<div id="yelpImage">'+
              '<img src="' + yelpArray[1] + '" alt="food">'+
            '</div>'+  
            '<p>Name: ' + yelpArray[0] + '</p>'+
            '<p>Address: ' + yelpArray[3] + '</p>'+
            '<p>Phone: ' + yelpArray[4] + '</p>'+
          '</div>'+
        '</div>';

        var infowindow1 = new google.maps.InfoWindow({
          content: contentString1
        });

        var marker1 = new google.maps.Marker({
          position: {lat: 27.538, lng: -82.379},
          map: map,
          title: 'Spot1',
        });

        marker1.addListener('click', function() {
          infowindow1.open(map, marker1);
        });  

        // ===============================================================================================

        var contentString2 = 
        '<div id="content">'+
          '<div id="bodyContent">'+
            '<img src="http://via.placeholder.com/350x150" alt="Mountain View">'+
            '<p>Name2</p>'+
            '<p>Address2</p>'+
            '<p>Phone Number2</p>'+
          '</div>'+
        '</div>';

        var infowindow2 = new google.maps.InfoWindow({
          content: contentString2
        });
        
        var marker2 = new google.maps.Marker({
          position: {lat: 29.538, lng: -80.379},
          map: map,
          title: 'Spot2'
        });

        marker2.addListener('click', function() {
          infowindow2.open(map, marker2);
        });      
        
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }