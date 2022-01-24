const express = require('express');
const router = express.Router();

var rooms = [{ roomNr: 'Analiza', picture: 6, password: '', idNumber: 1111, history: [] }];

var generate = function(n) {
  return Math.floor(Math.pow(10, n-1) + Math.random() * 9 * Math.pow(10, n-1));
}

// Welcome Page
router.get('/', (req, res) => res.render('welcome'));
router.post('/connecttochat', function(req, res) {
  var roomName = req.body.name;
  var found = false;
  var www ='';
  for (var i = 0; i < rooms.length; i++) {
  if(rooms[i].roomNr == roomName){
      found = true;
      www = '/chat/'+rooms[i].idNumber;
      console.log((new Date()) + ' Successful connection to ' + roomName + ' room');
      break;
    }
  }
  var ans = (found) ? {'error': false, 'msg': 'Super udało się połączyć, trwa przekierowywanie', 'www': www} : {'error': true, 'msg': 'Nie znaleziono takiego pokoju, spróbuj ponownie'}
  res.send(ans);
})
router.post('/createchat', function(req, res){
  var newRoom = req.body;
  var random = generate(4);
  var ans='';
  var alreadyExists = false;
  for (var i = 0; i < rooms.length; i++) {
    if(rooms[i].roomNr == newRoom.roomNr){
      alreadyExists = true;
      ans = {error: true, msg: 'Niestety istnieje już pokój o takim numerze'};
      console.log('Próba utworzenia pokoju zakończya się niepowodzeniem');
      break;
    }
    if(rooms[i].idNumber === random){
      random = generate(4);
      i = 0;
    }
  }
  if(!alreadyExists){
    newRoom.idNumber = random;
    newRoom.history = [];
    rooms.push(newRoom);
    var www = '/chat/'+newRoom.idNumber
    ans = {'error': false, 'msg': 'Super otworzyeś nowy pokój '+newRoom.roomNr+', za chwilę nastąpi przekierowanie', 'www': www};
    console.log('Utwórzono nowy pokój '+ newRoom.roomNr);
  }
  res.send(ans);
  console.log(rooms);
});
router.get('/chat/:idNumber', function(req, res){
  var msg = '';
  for (var i = 0; i < rooms.length; i++) {
    if(rooms[i].idNumber == req.params.idNumber){
      res.render('chat', {room: rooms[i]})
      break;
    }
  }
});
router.get('/bms', function(req, res){
  res.render('bms')
});

module.exports = {
  router: router,
  rooms: rooms
}
