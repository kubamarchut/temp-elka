const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyparser = require('body-parser');
const favicon = require('serve-favicon');
const webSocketServer = require('websocket').server;

var fromIndex = require('./routes/index');

var history = [];
var rooms = fromIndex.rooms;

const app = express();

// Setting ejs
app.use(expressLayouts);
app.use(bodyparser.json());
app.use(favicon(__dirname + '/assets/favicon.ico'))

app.set('view engine', 'ejs');

app.use('/assets',express.static('assets'))
// Routes
app.use('/', fromIndex.router)


const PORT = process.env.PORT || 8080;

var server = app.listen(PORT, console.log('Server started on port '+PORT));

// Starting WebSocket server
var wsServer = new webSocketServer({
    httpServer: server
});



wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    var connection = request.accept(null, request.origin);
    // we need to know client index to remove them on 'close' event
    var userName = false;
    var userColor = false;
    var place;
    var index;

    console.log((new Date()) + ' Connection accepted.');


    // user sent some message
    connection.on('message', function(message) {
        if (message.type === 'utf8') { // accept only JSON
            if (userName === false) { // first message sent by user is their name
              // remember user name
              var data = JSON.parse(message.utf8Data);
              userName = data.name;
              room = data.room;
              for (var i = 0; i < rooms.length; i++) {
                if(rooms[i].idNumber == room){
                  place = i;
                  break;
                }
              }
              if(typeof rooms[place].users == 'undefined') rooms[place].users = [];
              index = rooms[place].users.push(connection) - 1;
              console.log(rooms);
              // get random color and send it back to the user
              userColor = data.color;
              connection.sendUTF(JSON.stringify({ type:'color', data: userColor }));
              console.log((new Date()) + ' User is known as: ' + userName
                          + ' with ' + userColor + ' color.');

              if (rooms[place].history.length > 0) {
                connection.sendUTF(JSON.stringify( { type: 'history', data: rooms[place].history} ));
              }
            } else { // log and broadcast the message
                console.log((new Date()) + ' Received Message from '
                            + userName + ': ' + message.utf8Data);

                msg = message.utf8Data
                // we want to keep history of all sent messages
                var obj = {
                    time: (new Date()).getTime(),
                    text: msg,
                    author: userName,
                    color: userColor,
                };
                rooms[place].history.push(obj);
                rooms[place].history = rooms[place].history.slice(-250);

                // broadcast message to all connected clients
                var json = JSON.stringify({ type:'message', data: obj });
                for (var i=0; i < rooms[place].users.length; i++) {
                    rooms[place].users[i].sendUTF(json);
                }
            }
        }
    });

    // user disconnected
    connection.on('close', function(connection) {
        if (userName !== false && userColor !== false) {
            console.log((new Date()) + " Peer "
                + connection.remoteAddress + " disconnected.");
            // remove user from the list of connected clients
            rooms[place].users.splice(index, 1);
        }
    });

});
