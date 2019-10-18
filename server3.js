"use strict";
//var usersInDatabase = require("/data/users.json");
var fs = require ('fs');// allowsserver to read and write to files
var logger = require('morgan');
var express = require('express');
var mongo = require('mongodb').MongoClent;
var mongoose = require('mongoose');
var passport = require('passport'); 
var LocalStrategy = require('passport-local');
var session = require('express-session');

var bodyParser = require('body-parser'); // renders content from the front end to be used in the back end
var cookieParser = require("cookie-parser")
var app = express();
var path = require('path');
var server = require('http').createServer(app);

var expressValidator = require('express-validator');
var client = require('socket.io').listen(4000).sockets;



//************************************************************************
//Models
var User = require('./models/user.js');

//************************************************************************

// Sets up the Express app to handle data parsing


app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(session({secret:"This information is secret"}));



app.use(express.static(__dirname + '/'));  //set the base directory for static files like js and css
// ***********************************************************************
// Mongoose Connection
	var url = 'mongodb://localhost:27017/codespacedb';
	mongoose.connect('mongodb://127.0.0.1/codespacedb', function(err, db){

	if(err){
	  throw err;	
	}
	
	console.log('MongoDB connected...');

    // Connect to Socket.io
    client.on('connection', function(socket){
        let chat = db.collection('chat');

        // Create function to send status
        var sendStatus = function(s){
            socket.emit('status', s);
        }

        // Get chats from mongo collection
        chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
            if(err){
                throw err;
            }

            // Emit the messages
            socket.emit('output', res);
        });

        // Handle input events
        socket.on('input', function(data){
            let name = data.name;
            let message = data.message;

            // Check for name and message
            if(name == '' || message == ''){
                // Send error status
                sendStatus('Please enter a name and message');
            } else {
                // Insert message
                chat.insert({name: name, message: message}, function(){
                    client.emit('output', [data]);

                    // Send status object
                    sendStatus({
                        message: 'Message sent',
                        clear: true
                    });
                });
            }
        });

        
       
    });
});

//***********************Routes*********************************

// Directs to Login/sign up page w
app.get('/', function(req, res){
	if (req.session.email && req.session.password){
		res.redirect('/homepage');
	}

	else{
		res.sendFile(__dirname + '/html/UpdateLoginPage.html');
		
	}
});


//get  route /homepage to load homepage.html

app.get('/homepage', function(req, res){
	res.sendFile(__dirname + '/html/homepage.html');
	

});

// href route for all the forums on the homepage
app.get('/chatPage', function(req, res) {
  res.sendFile(__dirname + '/html/ForumLinksPage.html');
		
});



//href route that loads the members page
app.get('/membersPage', function(req,res){
	
		res.sendFile(__dirname + '/html/MembersPage.html');
	

});

// route that logs out of user session

app.get('/logout', function(req,res){
	req.logout();
	
	req.session.destroy();
	res.redirect("/");
});








//****************************************************************************************************
//***** SIGN UP/ SIGN IN ******

app.post('/signin', function(req, res){
	//console.log(usersInDatabase);

	var message = {
		msg: "",
		username: ""
	};
	var Email = req.body.email; //Declaring variabales
	
	var Password = req.body.password;
	console.log(Email,Password);
	
	User.findOne({email: Email,  password: Password}, function(error,user){
		if (error) {
			
		message.msg ="Sorry please try again";	
		}

		else{

			console.log(user);
			message.msg = "yes";
			message.name = user.name;
			console.log(message);
			console.log("We found the user");
			req.session.name = message.name;
			req.session.email = req.body.email;
			req.session.password = req.body.password;
			console.log(req.session.name);
			console.log(req.session.email);
			console.log(req.session.password);
			res.json(message);


		}
	});		


});




app.post('/signup', function(req, res){
	var message = {
		msg: ""
	};

	var Email = req.body.email;
	var Password = req.body.password;
	var Name = req.body.name;
	
	
	//console.log(Email,Password,Name);
	
	User.findOne({email: Email,  name: Name}, function(err,user){
			if (user){
				message.msg ="Sorry" + " " + "the email" + " " + req.body.email + " " + "is already in use";
				
				
			}

			else{

				
					message.msg ="Thanks For Joining" + " " + req.body.name + "."  + " "+ "Please login to explore!!";
				
			
				var newUser = {
				email: req.body.email,
				password: req.body.password,
				name: req.body.name
				
			
				
			}
			req.session.name = req.body.name;
			req.session.email = req.body.email;
			req.session.password = req.body.password;
			console.log(req.session.name);
			console.log(req.session.email);
			console.log(req.session.password);	
			var newUsers = new User(newUser); // variable "newUsers" = new "insert model name"("insert record name")
			
			newUsers.save(function(err, newUser){
				if(err) res.json(err);
				else res.send("successfully inserted");
				
			});
			}

			res.json(message);
			
	});

	
		
	});


function findUser(userInfo, usersInDatabase)
{	console.log("**********");
for(var i = 0; i < usersInDatabase.length; i++)
{
	var user = usersInDatabase[i];
	if(user.email === userInfo.email && user.password === userInfo.password )
	{
		return user.name;
	}
}
return false;


}

function findInfo(userInfo, usersInDatabase)
{
	
	for(var j = 0; j < usersInDatabase.length; j++)
	{
		var user = usersInDatabase[j];
		//console.log(user.userName);
		if(user.name == userInfo)
		{
			return user;
			
		}
	}
	return false;
}

//***********************************************************************************

app.get('/users', function(req, res){
	var message = {
		msg: ""
	};
	
	fs.readFile(__dirname + "/data/userProfile.json", function(err, data)
	{
		if(err) throw err;  //if file isn't found or something like that throw an error message
		var usersInDatabase = JSON.parse(data);
		console.log(usersInDatabase);
		
		//currently we will send a message
		res.json(usersInDatabase);
	});
});


app.get('/profile', function(req, res){
	
	console.log(req.query.name);
	
	fs.readFile(__dirname + "/data/userProfile.json", function(err, data)
	{
		if(err) throw err;  //if file isn't found or something like that throw an error message
		var usersInDatabase = JSON.parse(data);
		console.log(usersInDatabase);
		var record = findInfo(req.query.name, usersInDatabase);
		
		if(record){

			var rec = {};
			rec.id = record.id;
			rec.bio = record.bio;
			rec.college = record.college;
			rec.collegeInfo = record.collegeInfo;
			rec.skills =record.skills;
			rec.occupation = record.occupation;
			rec.name = record.name;
			rec.image = record.image;
			rec.gender = record.gender;
			rec.birthday =record.birthday;
			res.json(rec); 
		}

		else{

			var rec = {};
			rec.message= "Nothing";
			
		}
	});
});

app.get('/profile2', function(req, res){
	
	console.log(req.query.name);
	
	fs.readFile(__dirname + "/data/userProfile.json", function(err, data)
	{
		if(err) throw err;  //if file isn't found or something like that throw an error message
		var usersInDatabase = JSON.parse(data);
		var record = findInfo(req.query.name, usersInDatabase);
		
		if(record){

			var rec = {};
			rec.id = record.id;
			rec.bio = record.bio;
			rec.college = record.college;
			rec.collegeInfo =record.collegeInfo;
			rec.skills =record.skills;
			rec.occupation = record.occupation;
			rec.name = record.name;
			rec.image = record.image;
			rec.gender = record.gender;
			rec.birthday =record.birthday;
			res.json(rec); 
		}

		else{

			var rec = {};
			rec.message= "Nothing";
			
		}
	});
});












server.listen(process.env.PORT || 3000);
console.log('Server is running on port 3000!');