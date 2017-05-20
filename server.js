var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var server = app.listen(PORT, function(){
  console.log('working!!');
});

app.use(express.static('public'));

var socket = require('socket.io');

var io = socket(server);
var clients = {};
io.sockets.on('connection', newConnetion)

function newConnetion(socket) {
  
  
  socket.on('balls', sendDataballs);
  socket.on('joints', sendDatajoints);
  socket.on('add-user', addUser);
  socket.on('updateActive', updateActive);
  socket.on('rotate', rotates);
  socket.on('ropeVal', ropes);
  socket.on('User_added', UserAdded);
  
  function UserAdded(data, user) {
    clients[user].emit('rotate', data);
  }
  function rotates(data, user) {
    // io.sockets.emit('rotate', data)
    clients[user].emit('rotate', data);
  }
  function sendDataballs(data, sendingToUsers) {
    // console.log(clients);
    // socket.broadcast.emit('balls', data);
    //trigger to emit 
    clients[sendingToUsers].emit('balls', data);
    // add socket.on('privitBall', data); to client side

  }
  function sendDatajoints(data) {
    socket.broadcast.emit('joints', data);
    // console.log(data);
  }
  function ropes(data, sendingToUsers) {
      clients[sendingToUsers].emit('Ropedata', data);
  }
  function addUser(data, callback) {
    if (data in clients) {
      callback(false);
    }else{
      callback(true);
      socket.nickname = data;
      clients[socket.nickname] = socket;
      // console.log(clients);
      // socket.emit('clients', clients)
      updateClients();
    }
  }
  socket.on('disconnect', function(data) {
    if (!socket.nickname) return;
      delete clients[socket.nickname];
      updateClients();

   });
  function updateClients(){
    io.sockets.emit('clients', Object.keys(clients))
  }
  function updateActive(data){
    socket.broadcast.emit('updateActive', data)
  }

}