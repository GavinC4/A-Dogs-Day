// Node Dependencies
var express = require('express');
var bodyParser = require('body-parser'); 
var path = require('path');
var router = express.Router(); 
var exphbs = require("express-handlebars");

//Authentication packages
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require("./config/passport");
var MySQLStore= require('express-mysql-session')(session);

var db = require("./models");

var app = express();
var server = require('http').createServer(app);
var io = require('./socket/socket').io;
io.listen(server);

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());

// Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Serve static content for the app from the "public" directory in the application directory.
app.use(express.static('public'));

//mysql session store instance
var sessionStore = new MySQLStore({
    host: "localhost",
    user: "root",
    password: "root",
    port: 8889,
    database: "userdb"
});

//session middleware
var sessionMW = session({
    secret: 'my_dog_secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore
});

app.use(sessionMW);
//use the same session middleware as a Socket.IO middleware
io.use(function(socket, next) {
    sessionMW(socket.request, socket.request.res, next);
});

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    // res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.user = req.user;
    next();
});

//Routes
//I moved this code into user-controller.js  ---wenfang
//DATA
// var listAct = [
//      { plan1: "EAT." },
//      { plan2: "DRINK." },
//      { plan3: "PLAY." },
//      { plan4: "SHOP." }
// ];

// app.get("/", function(req,res) {
//  res.render('index', {index: listAct});
// });

// loads main html at server start
// app.get("/", function(req,res) {
//  res.sendFile(__dirname + "/view/index.html");
// });

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

require("./routes/user-controller.js")(app);

// Open Server
var PORT = process.env.PORT || 3000; 

db.sequelize.sync().then(function() {
  server.listen(PORT, function() {
    console.log("APP listening on port %s.", PORT);
  });
});