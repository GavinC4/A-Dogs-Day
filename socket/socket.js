
var db = require('../models');
var io = require('socket.io')();

// var userSockets = {};

io.on('connection', function (socket) {
  console.log("A logged-in client has connected");
  console.log('Socket session object', socket.request.session);
  // console.log('Serialized user from passport', socket.request.session.passport.user);

  // var user_id = socket.request.session.passport.user;

  // userSockets[user_id] = socket;

  // desired query (in order to find out the user's favorite thing to do in a favorite location)
  // SELECT category, srchLocation, srchCategory
  // FROM Activity
  // WHERE userId = user_id
  // AND category IN 
  // (SELECT category
  // FROM Activity
  // WHERE userId = user_id
  // GROUP BY category
  // ORDER BY COUNT(category) DESC
  // LIMIT 1)
  // GROUP BY srchLocation 
  // ORDER BY COUNT(srchLocation) DESC

  socket.on('returninguser', function(name) {
    var maxcategory;
    var maxlocation;

    db.Activity.findAll({
      attributes: ['category'],
      where: {
        userName: name
      },
      group: ['category'],
      order: [db.sequelize.fn('count', db.sequelize.col('category')), 'DESC'],
      limit: 1 //redundant
    }).then(function(result) {
      if(result) {
        var maxcategory = result[0].category;
        console.log(maxcategory);
        db.Activity.findAll({
          // attributes: ['category', 'srchLocation', 'srchCategory'], 
          attributes: ['category', 'srchLocation'], 
          where: {
            userName: name,
            category: maxcategory   //or maybe just need match userid
          },
          group: ['srchLocation'],
          order: [db.sequelize.fn('count', db.sequelize.col('srchLocation')), 'DESC']
        }).then(function(queryRes) {
          if(queryRes) {
            maxlocation = queryRes[0].srchLocation;
            var recommended = {
              message: "Want to try these places in your area? They are five-star rated!",
              category: maxcategory,
              srchLocation: maxlocation
            };
            return socket.emit('recommend', recommended);
          }
        });
      }
      else {
        return console.log("No user activity data yet");
      }
    });
  });

  //if a new user registered, introduce him/her to other users
  socket.on('newuser', function(name) {
    //emit welcome message
    var msg = "" + name + " just joined us! Say hi to " + name;
    return socket.broadcast.emit('broadcast', msg);  //sending to all clients except the sender
  });

  //save user activities
  socket.on('activity', function(data) {
    // var userLoc = JSON.parse(data.userLocation);
    // var lat = userLoc.lat;
    // var lng = userLoc.lng;
    db.Activity.create({
      category: data.category,
      srchTerm: data.srchTerm,
      srchLocation: data.srchLocation,
      srchCategory: data.srchCategory,
      userName: data.username
    }).then(function(activity) {
      return console.log(activity);
    }).catch(function(err) {
      return console.error(err);
    })
  });

  //on logging out
  socket.on('loggingout', function () {
    // delete userSockets[user_id];
    return console.log('The client has logged out');
  });

  socket.on('disconnect', function () {
    // delete userSockets[user_id];
    return console.log('The client has disconnected');
  });
});

// Export module
module.exports = {io : io};