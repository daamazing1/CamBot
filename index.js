var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var SerialPort = require('serialport').SerialPort;
var serial = new SerialPort('/dev/ttymxc3', {
    baudrate: 115200,
});

serial.on('open',function(){//make sure we have a serial connection
    console.log('serial connection extablished');

    app.get('/', function(req, res){
        res.sendfile('index.html');
    });

    io.on('connection', function(socket){
        console.log('a user connected');
        socket.on('disconnect', function(){
            console.log("user disconnected");
            serial.close();
        });
        socket.on('motor',function(data){
            console.dir(data);
            //first nibble contains the motor number
            //second nibble holds the command
            var firstbyte = (data.motor << 4) | data.command;
            //second byte holds the speed
            var secondbyte = data.speed;
            serial.write([firstbyte,secondbyte]);
            console.log("first: " + firstbyte);
            console.log("second: " + secondbyte);
        });
    });

    http.listen(3000, function(){
        console.log('Listening on port 3000');
    });
});


