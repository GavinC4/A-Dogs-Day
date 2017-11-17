$(document).ready( function () {
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    // 
    var initialHref = window.location.href;
    console.log(window.location.href);
    //This is to initialize all modals         
    $('.modal').modal();

    $('.btnlog').on('click', function () {
      // $('#login').modal();
      $('#login').modal('open');
    });
    $('.btnsign').on('click', function () {
      // $('#signup').modal();
      console.log(window.location.href);
      $('#signup').modal('open');
      console.log(window.location.href);
      console.log(window.location.origin);

    }); 

    //user logic below

    var socket;
    var usrnm;
    var rootURL = window.location.origin;
    console.log(rootURL);

    (function() {
      if(localStorage.getItem("user")) {
        // socket = io.connect();
        usrnm = localStorage.getItem("user");
        socket = io.connect('http://127.0.0.1:3000'); //or use rootURL in deployment
        socket.on('connect', function () {
          console.log('Now connected to socket and the user name is ' + usrnm);
          if(localStorage.getItem('new') === true) {
            $("#welcome-from-server").html("<h1 class='welcome'>Welcome " + usrnm + " !</h1>");
            localStorage.setItem("new", false);
            socket.emit('newuser', usrnm);
          }
          else {
            socket.emit('returninguser', usrnm);
          }
          // sessionStorage.clear();
        });
      }
      else {
        console.log('no storage data');
      }
    })();


    $('#registerForm').submit(function(event) {
        event.preventDefault();
        var formData = {
            'username': $("#newusername").val().trim(),
            'email': $("#newemail").val().trim(),
            'password': $("#newpassword").val().trim()
        };
        //front-end form validation 
        if(!formData.username || !formData.email || !formData.password) {
            alert("Please fill out all fields before submitting!");
        }
        else if(formData.password.length < 8 || formData.password.length > 20) {
            alert("Password must be 8-20 characters long!");
        }
        else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email))) {
            alert("Please enter a valid email address!");
        }
        else {
            $.post('/register', formData, function(res) {
                console.log(res);
                // location.reload(); 
                if(res.registerErr) {
                    var errUl = $("#registerErr").append('<ul></ul>').find('ul');
                    for(var i=0; i<res.registerErr.length; i++) {
                        var errLi = $("<li class='alert alert-danger'>" + res.registerErr[i].msg + "</li>");
                        errUl.append(errLi);
                    }
                    // $('#signup').modal('open');
                }
                else if(res.registeredUser) {
                    localStorage.clear();
                    localStorage.setItem("user", res.registeredUser);
                    localStorage.setItem("new", true);
                    console.log(window.location.href);

                    if(initialHref !== window.location.origin) {
                        console.log(initialHref);
                        console.log(rootURL);
                        window.location.replace(initialHref);
                    }
                    else {
                        window.location.replace(initialHref);
                    }

                    // window.location.replace(rootURL);
                    
                    // console.log("user stored in session storage " + sessionStorage.getItem("user"));
                    // console.log(window.location.href);
                
                    // socket = io.connect();
                    // socket = io.connect('http://127.0.0.1:8080');
                    // socket.on('connect', function () {
                    //     console.log('Now connected to socket and the user name is ' + formData.username);
                    //     $("#welcome-from-server").html("<h1 class='welcome'>Welcome " + formData.username + " !</h1>");
                    //     socket.emit('newuser', formData.username);
                    // });
                }
            });
        }
    });


    $('#loginForm').submit(function(event) {
        event.preventDefault();
        var formData = {
            'username': $("#username").val().trim(),
            'password': $("#password").val().trim()
        };

        if(!formData.username || !formData.password) {
            alert("Please fill out all fields before submitting!");
        }
        else {
          console.log(formData);
          $.post('/login', formData, function(res) {
              console.log(res);
              if(res.loginErr) {
                  $("#loginErr").html("<p class='alert alert-danger'>" + res.loginErr + "</p>");
                  // $('#login').modal('open');
              }
              else if(res.loggedinUser) {
                  console.log("The logged in user is " + res.loggedinUser);
                  localStorage.clear();
                  localStorage.setItem("user", res.loggedinUser);
                  localStorage.setItem("new", false);

                  // window.location.replace(rootURL);
                  if(initialHref !== window.location.origin) {
                      console.log(initialHref);
                      console.log(rootURL);
                      window.location.replace(initialHref);
                  }
                  else {
                      window.location.replace(initialHref);
                  }
              }
          });
        }
    });

    $(".btnout").click(function() {
        localStorage.clear();
        if(typeof socket !== 'undefined') {
            socket.emit('loggingout');
        }
        $.get('/logout', function() {
            console.log("User data are gone");
        });
        $("#welcome-from-server").innerHTML= '';
    });

      //inside a block for handling click event on google map, before a post request to the yelp route, this function 
      //will be called to emit an activity event to server socket
    //activityObj contains category, srchTerm, srchLocation, and maybe srchCategory if diffenent from category. 

    var saveActivity = function(activityObjStringified) {     

        //attach userLocation to activityObj
        // var userLoc = localStorage.getItem("userLocation");
        // if(userLoc) {
        //   activityObj['srchLocation'] = userLoc;
        // }
        if(typeof socket !== 'undefined')
          var activityObj = JSON.parse(activityObjStringified);
          activityObj['username'] = usrnm; 
          socket.emit('activity', activityObj);
    };

    if(typeof socket !== 'undefined') {

        socket.on('broadcast', function (msg) {
            //better to use a notification box to display 
            Notify(msg, null, null, 'success');
        });

        socket.on('recommend', function(recommended) {
            $("#welcome-from-server").append("<h1 class='welcome'>" + recommended.message + "</p>");
            delete recommended[message];
            $.post('/api/yelp', recommended, function(res) {   //pseudocoded call yelp api route, return 5-star rated places and display in list
                console.log(res);
            })          
        });

    }

});

  
// console.log("THIS IS THE PROJECT");

