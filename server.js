var express = require('express');
var path = require('path');
var app = express();
var chatbox = [];

var users = [];

app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
	res.render('index');
})

var server = app.listen(8000);
var server = app.listen(server);
var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket){

	console.log('using socket');

chatting();
function chatting(){
	var name = '';

	socket.on('new_name', function(data){
		name = data;
		users.push(name);
		chatbox.push({ new_user: data + ' has signed on' });
		socket.emit('show_chatbox', chatbox);
		io.emit('update_chatbox', chatbox);
		io.emit('display_users', users);
	});

	socket.on('add_message', function(data){
		chatbox.push(data);
		io.emit('update_chatbox', chatbox);
	});


 	socket.on('disconnect', function(){
 		console.log('disconnect');
		chatbox.push({disconnecting: name + ' has disconnected'});
		io.emit('update_chatbox', chatbox);

		var temp = 0;
		for(var i=0; i<users.length; i++){
			if(users[i] == name){
				temp = users[i];
				users[i] = users[users.length-1];
				users[users.length-1] = temp;
				users.pop();
				console.log(users);
			}
		}
		io.emit('display_users', users);
		

	});



 }


})