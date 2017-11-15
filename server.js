// Node Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var router = express.Router();

var app = express();
//Serve static content for the app from the "public" directory in the application directory.
// app.use(express.static(process.cwd()));
// app.use(express.static(__dirname, "/public"));
app.use(express.static('public'));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Handlebars
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//DATA
var listAct = [
		{ plan1: "EAT." },
		{ plan2: "DRINK." },
		{ plan3: "PLAY." },
		{ plan4: "SHOP." }
];

app.get("/", function(req,res) {
	res.render('index', {index: listAct});
})

// Open Server
// var port = process.env.PORT || 8080;
// app.listen(port);
// console.log("liseting to port " + port);

// var router = require('');
// app.use('/', router);

// loads main html at server start
app.get("/", function(req,res) {
	res.sendFile(__dirname + "/view/index.html");
});

// Gets all restaurants
app.get("/api/restaurant", function(req, res) {
	// This is where Yelp api request happens
	var fromYelp = restaurant();
	res.json(fromYelp);
});

var yelp = require('yelp-fusion');

// Moved token so its not included in repo
// var config = require(__dirname + "/config.json");
// var client = yelp.client(config.token);

// RESTAURANT - DOG FRIENDLY =======================================
function restaurant() {

    var locationArray = [];

    client.search({
      term:'dog friendly',
      location: 'orlando, fl', // update with current location
      categories: "restaurants"
    }).then(response => {

        var res = response.jsonBody.businesses;

        for (var i = 0; i < 1; i++) {

            // console.log(res[i]);
            locationArray.push(
                res[i].name, 
                res[i].image_url, 
                res[i].location.display_address, 
                res[i].display_phone, 
                res[i].coordinates
            );
        }

        console.log("******** PRINTS TO TERMAINAL ************");
        console.log(locationArray);
        console.log("*****************************************");
        return locationArray;

    }).catch(err => {
        console.log(err);
    });
}

// Open Server
var PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});

