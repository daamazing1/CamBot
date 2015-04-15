var cambot = (function(c){
    var socket = io();
    //from Adafruit arduino library to keep consistant
    var forward = 1;
    var backward = 2;
    var release = 4;
    //gamepad code
    var emitGP;
    var debug = true;
    var leftSpeed = 0;
    var rightSpeed = 0;

    var LOG = debug ? console.log.bind(console) : function () {};

    //Check browser for compatibility
    function gamepadSupported(){
        return "getGamepads" in navigator;
    }

    //run countuously every x ms to emit the current gamepad values to nodejs
    //via sockets.
    function emitGamepad(){
        var gp = navigator.getGamepads()[0];
        LOG("id: " + gp.id);

        for(var i=0,j=gp.axes.length;i<j;i+=2){
            LOG("Stick " + (Math.ceil(i/2)+1) + ": " + gp.axes[i] + "," + gp.axes[i+1]);
        }

        var tLeftSpeed = Math.floor(Math.abs((gp.axes[1]*gp.axes[1]) * 255)); 
            leftSpeed = tLeftSpeed;
            socket.emit('motor',{
                motor:1,
                command:(gp.axes[1]>0?forward:gp.axes[1]<0?backward:release),
                speed:Math.floor(Math.abs(gp.axes[1] * 255))
            });

        var tRightSpeed = Math.floor(Math.abs((gp.axes[3]*gp.axes[3]) * 255));
            rightSpeed = tRightSpeed;
            socket.emit('motor',{
                motor:2,
                command:(gp.axes[3]>0?forward:gp.axes[3]<0?backward:release),
                speed:Math.floor(Math.abs(gp.axes[3] * 255))
            });
    }

    function gamepadConnected(){
        LOG("Gamepad connected");
        emitGP = window.setInterval(emitGamepad,500);
    }

    function gamepadDisconnected(){
        LOG("Gamepad disconnected");
        window.clearInterval(emitGP);
    }

    c.activate = function activate(){
        //Removed the gamepad code because it was a pain in the ass to
        //constantly go find a gamepad to hook up to the computer.  This is an
        //alternative solution.  Not as cool but still usable.
        $('#left-wheel-slider').slider({
            orientation:'vertical',
            range: 'min',
            min: 0,
            max: 255,
            value: 0,
            slide: function(event, ui){
                $('#left-speed').val(ui.value);
                socket.emit('motor',{
                    motor:1,
                    command:forward,
                    speed:ui.value
                });
            }
        });
        $('#right-wheel-slider').slider({
            orientation:'vertical',
            range: 'min',
            min: 0,
            max: 255,
            value: 0,
            slide: function(event, ui){
                $('#right-speed').val(ui.value);
                socket.emit('motor',{
                    motor:2,
                    command:forward,
                    speed:ui.value
                });
            }
        });
    };

    return c;
})(cambot || {});
