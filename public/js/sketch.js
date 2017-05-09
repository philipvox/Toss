var debug = true;

//Matter
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Events = Matter.Events,
    Bodies = Matter.Bodies,
    Cons = Matter.Constraint,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Cons = Matter.Constraint,
    Composite = Matter.Composite,
    Sleeping = Matter.Sleeping,
    Plugin = Matter.Plugin,
    Detector = Matter.Detector
    Common = Matter.Common;


//socket referance
var socket;
//P5
var engine;
var world;
var canvas;
var MouseMatter;
var ip;
var UserID;
//Boundies
var elements = [];
var obj = [];
var joints = [];
var ActiveUser = {};
var deleteJoints = [];
//Boundies
var wall1, wall2, wall3;
//Touch Start Time and Touch End Time
var startV;
var time;
//set bounce and friction of drawn content
var wallWidth = 100;
var bounced = .6;
var frictioned = 0.01;
var stiff = .09;
var JointConnectionDely = 250;
var objCount = 0;
var BallsOut = 0;
//Floor & Walls Left/Right
var fl;
var wallL;
var wallR;
var topfl;
var my;
p5.disableFriendlyErrors = true;

engine = Engine.create();
world = engine.world;
// var rope = [];
// Matter.use('matter-collision-events');
function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('myContainer');
    Engine.run(engine);
    socket = io.connect();
    socket.on('balls', InitDrawing);
    socket.on('clients', userUpdate);
    // socket.on('Ropedata', GetRopes);
    fl = new Boundry(width / 2, height + (wallWidth / 2), width, wallWidth);
    wallR = new Boundry(width + (wallWidth / 2), height / 2, wallWidth, height + 1000);
    wallL = new Boundry(0 - (wallWidth / 2), height / 2, wallWidth, height + 1000);
    topfl = new Boundry(width / 2, 0 - (wallWidth / 2), width, wallWidth);
    mouseCon();
    mobileON = mobilecheck();
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      var crd = pos.coords;
      $('#Acc1').html(`More or less ${crd.accuracy} meters.`)
      console.log('Your current position is:');
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      console.log(`More or less ${crd.accuracy} meters.`);
      my = {lat:crd.latitude, lon:crd.longitude};

    };

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);

}
function draw() {
    background('#ECEFF1');

    for (var i = 0; i < joints.length; i++) {
        joints[i].show();
        jointRemover(i);
    }

    for (var i = 0; i < elements.length; i++) {
        elements[i].show();
        var y = elements[i].body.position.y;
        var x = elements[i].body.position.x;
        var force = Matter.Vector.div(Matter.Vector.mult(elements[i].body.velocity, -1), 1000);
        SendBallConstructor(elements, i, x, y, force);

    }
    for (var i = 0; i < dots.length; i++) {
        dots[i].show();
    }
    if (ShapesActive) {
        DrawingSelected();
    }
    
    if (Object.keys(ActiveUser).length == 0) {
        if (topfl === 'nothing') {
            topfl = new Boundry(width / 2, 0 - (wallWidth / 2), width, wallWidth);
            topfl.show();
        }
    }else{
        if (topfl != 'nothing') {
            topfl.removeFromWorld();
            topfl = 'nothing';
        }
    }
    if (TextActive) {
        var value = $('#textinput').val();
        var fontsize = 24;
        push();
            fill('#B0BEC5');
            translate(width/2, height/2);
            textSize(fontsize);
            textAlign(CENTER);
            text(value, 0, 0);
            // var text = text(value, 0, 0);

        pop();
    }
    for (var i = 0; i < textcontent.length; i++) {
        textcontent[i].show();
    }
    Engine.update(engine);
}
var textcontent = [];


function jointRemover(j) {
    var aPosY = joints[j].a.position.y, 
        aVelY = joints[j].a.velocity.y,
        bPosY = joints[j].b.position.y,
        bVelY = joints[j].b.velocity.y;

    if (((aPosY< -20) && (aVelY < 0)) || ((bPosY < -20) && (bVelY < 0))){
        joints[j].removeFromWorld();
        joints.splice(j, 1);
    }else{
        if (userExisted(elements, joints[j].b.label)) {

        }else{
            joints[j].removeFromWorld();
            joints.splice(j, 1);
        }
    }
    // for (var i = 0; i < elements.length; i++) {

    
    
}
function userExisted(arr,newlabel) {
  return arr.some(function(el) {
    return el.body.label === newlabel;    
  }); 
}

BallsOutArr = [];
function SendBallConstructor(elements, i, x, y, force) {
    if ((y < - 2) && (elements[i].body.velocity.y < 0)) {

        var ball = {
            x: x,
            y: y,
            w: elements[i].w,
            h: elements[i].h,
            CRadius: elements[i].r,
            Bounce: bounced,
            Friction: frictioned,
            ID: elements[i].body.label,
            Type: elements[i].type,
            connections: elements[i].connections,
            force: force,
            sentCount: BallsOut,
            color: elements[i].color,
            lat:my.lat,
            long:my.lon
        };
        BallsOutArr.push(ball);
        ballsOut();

        elements[i].removeFromWorld();
        elements.splice(i, 1);

    }
}
function emitBalls(data) {
    if (Object.keys(ActiveUser).length === 0) {
            socket.emit('balls', data, MyName);
        } else {
            for (var i = 0; i < Object.keys(ActiveUser).length; i++) {
                socket.emit('balls', data, Object.keys(ActiveUser)[i]);
            }
        }
}
function ballsOut() {
    setTimeout(function() {
        if (BallsOutArr.length >= 2) {
            emitBalls(BallsOutArr);
            BallsOutArr = [];

        }else{
            emitBalls(BallsOutArr);
            BallsOutArr = [];   
        }
    }, 500);
}
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
function InitDrawing(data) {

    console.log(getDistanceFromLatLonInKm(data.lat,data.lon,my.lat,my.lon,));

    var prev = [];
    if (data.length == 1) {
        var x = data[0].x;
        var y = 0;
        var r = data[0].CRadius;
        var w = data[0].w;
        var h = data[0].h;
        var bounce = data[0].Bounce;
        var friction = data[0].Friction;
        var force = data[0].force;
        var id = data[0].ID;
        var sentCount = data[0].sentCount;
        var type = data[0].Type;
        var connection = data[0].connections
        var color = data[0].color
        var c = new circ(x, y, r, bounce, friction, id, force, connection, color);
        elements.push(c);
    }else{
        for (var i = 0; i < data.length; i++) {
            var x = data[i].x;
            var y = 0;
            var r = data[i].CRadius;
            var w = data[i].w;
            var h = data[i].h;
            var bounce = data[i].Bounce;
            var friction = data[i].Friction;
            var force = data[i].force;
            var id = data[i].ID;
            var sentCount = data[i].sentCount;
            var type = data[i].Type;
            var connection = data[i].connections
            var color = data[i].color
            var c = new circ(x, y, r, bounce, friction, id, force, connection,color);
            elements.push(c);
            if (prev){
                    var first,second;
                    for (var m = 0; m < elements.length; m++) {
                        for (var d = 0; d < c.connections.length; d++) {
                            for (var x = 0; x <  elements[m].connections.length; x++) {
                                if (elements[m].connections[x].a == c.connections[d].a) {
                                    first = c.body;
                                }
                                if (c.connections[d].b == elements[m].connections[x].b) {
                                    second = elements[m].body
                                }
                                if (first != undefined && second != undefined) {
                                    var labels = first.label+second.label
                                    if (!(userExists(joints, labels))) {

                                        var j = new Constraint(first, second,(first.circleRadius + second.circleRadius)*1.5, stiff, labels)
                                        joints.push(j); 
                                        console.log(j); 
                                    }
                                }
                            }
                        }
                    }
            }
            prev.push(c);
        }
    }
    

}

function userExists(arr,newlabel) {
  return arr.some(function(el) {
    return el.label === newlabel;
  }); 
}
function superJoin(Connections,type) {
    var first,
        second;
    
    setTimeout(function() {
        for (var f = 0; f < elements.length; f++) {
            for (var i = 0; i < Connections.length; i++) {
                    if (elements[f].body.label == Connections[i].a) {
                        first = elements[f].body;
                    }else if (elements[f].body.label == Connections[i].b) {
                         second = elements[f].body;
                    }
                }
            }
        joints.push(new Constraint(first, second, first.circleRadius + second.circleRadius * 1.5, stiff));
    }, 150);
}

function updateGravity(event) {
    if (GravityActive) {
        if (!engine) return;
        var orientation = window.orientation,
            gravity = engine.world.gravity;
        if (orientation === 0) {
            gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
            gravity.y = Common.clamp(event.beta, -90, 90) / 90;
        } else if (orientation === 180) {
            gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
            gravity.y = Common.clamp(-event.beta, -90, 90) / 90;
        } else if (orientation === 90) {
            gravity.x = Common.clamp(event.beta, -90, 90) / 90;
            gravity.y = Common.clamp(-event.gamma, -90, 90) / 90;
        } else if (orientation === -90) {
            gravity.x = Common.clamp(-event.beta, -90, 90) / 90;
            gravity.y = Common.clamp(event.gamma, -90, 90) / 90;
        }
    } else {
        engine.world.gravity.x = 0;
        if (debug) {
        engine.world.gravity.y = 1;
        }else{
        engine.world.gravity.y = 0;
        }
    }
};

function UniqueID() { return '_' + Math.random().toString(36).substr(2, 9); }

function pushCirc(bsX, bsY, bw, bounced, frictioned, elements, bh, id) {

    if (actv_btn === 'square') {
        elements.push(new Box(bsX, bsY, bw, bh, 0, 1, id))
    } else if (actv_btn === 'circle') {
        

        if (StaticActive && ShapesActive) {
            var ball = new circ(bsX, bsY, bw, bounced, frictioned, id);
            elements.push(ball)
        ball.static = true;
        ball.stroke = true;
        ball.strokeColor = 'black';
        Matter.Body.setStatic(ball.body, true);

        }else{
            var ball = new circ(bsX, bsY, bw, bounced, frictioned, id);
            elements.push(ball);
        }
        
        
       
    } else if (actv_btn === 'poly') {
        elements.push(new Box(bsX, bsY, bw, bh, bounced, frictioned, id))
    } else if (actv_btn === 'emoji') {
        elements.push(new circ(bsX, bsY, bw, bounced, frictioned, id))
    } else if (actv_btn === 'text_btn') {
        elements.push(new Box(bsX, bsY, bw, bh, bounced, frictioned, id))
    }
}

function touchStarted(){
    startV = createVector(mouseX, mouseY);
    time = new Date().getMilliseconds();
}

function touchEnded() {
    if (ShapesActive === true) {
        var endV = createVector(mouseX, mouseY);
        var endTime = new Date().getMilliseconds();
        var bw = endV.x - startV.x
        var bh = endV.y - startV.y
        pushCirc(startV.x, startV.y, bw, bounced, frictioned, elements, bh, UniqueID());
    }
}


function fullScreen() {
    // var elem = document.getElementById("myElement");
    // if (!document.elem && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
    //     if (elem.requestFullscreen) {
    //         elem.requestFullscreen();
    //         canvas.size(windowWidth, windowHeight);
    //     } else if (elem.mozRequestFullScreen) {
    //         elem.mozRequestFullScreen();
    //         canvas.size(windowWidth, windowHeight);
    //     } else if (elem.webkitRequestFullscreen) {
    //         elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    //         canvas.size(windowWidth, windowHeight);
    //     }
    // }
    // canvas.size(windowWidth, windowHeight);
};
