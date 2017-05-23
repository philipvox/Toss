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
var stiff = .2;
var JointConnectionDely = 250;
var objCount = 0;
var BallsOut = 0;
//Floor & Walls Left/Right
var fl;
var wallL;
var wallR;
var topfl;
var my = {};
var sendDelay = 300;
var context;
p5.disableFriendlyErrors = true;

engine = Engine.create();
world = engine.world;
Matter.use('matter-attractors');
Matter.use('matter-wrap');

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    // context = canvas.getContext('2d');
    canvas.parent('myContainer');
    Engine.run(engine);
    socket = io.connect();
    socket.on('balls', InitDrawing);
    socket.on('clients', userUpdate);
    socket.on('NotificationAdded', NotificationAdded);
    
    // socket.on('Ropedata', GetRopes);
    fl = new Boundry(width / 2, height + (wallWidth / 2), 5000, wallWidth);
    wallR = new Boundry(width + (wallWidth / 2), height / 2, wallWidth, height + 1000);
    wallL = new Boundry(0 - (wallWidth / 2), height / 2, wallWidth, height + 1000);
    topfl = new Boundry(width / 2, 0 - (wallWidth / 2),5000, wallWidth);
    mouseCon();
    mobileON = mobilecheck();
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      var crd = pos.coords;
      // $('#Acc1').html(`More or less ${crd.accuracy} meters.`)
      // console.log('Your current position is:');
      // console.log(`Latitude : ${crd.latitude}`);
      // console.log(`Longitude: ${crd.longitude}`);
      // console.log(`More or less ${crd.accuracy} meters.`);
      my['lat'] = crd.latitude
      my['lon'] = crd.longitude;
      console.log(my);

    };

    function error(err) {
      // console.warn(`ERROR(${err.code}): ${err.message}`);
    };
    navigator.geolocation.getCurrentPosition(success, error, options);
}
function draw() {
    // background('#ECEFF1');
    background('#263238');
    if (ShapesActive) {
        DrawingSelected();
    }
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
            lon:my.
            lon
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
function Usersadded(data) {
    if (Object.keys(ActiveUser).length != 0) {
        for (var i = 0; i < Object.keys(ActiveUser).length; i++) {
            socket.emit('User_added', data, Object.keys(ActiveUser)[i]);
        }
    }
}
function UsersRecieved(data) {
    $('#popup').show();
    $('#Adduser').text(data);
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
    }, sendDelay);
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
    var prev = [];
    // if ((data[0].lat)&&(data[0].lon)&&(my.lat)&&(my.lon)) {
    //     var distance = getDistanceFromLatLonInKm(data[0].lat,data[0].lon,my.lat,my.lon);
    // }
    if (data.length == 1) {
        var x = data[0].x;
        var y = 0;
        var r = data[0].CRadius;
        var w = data[0].w;
        var h = data[0].h;
        var bounce = data[0].Bounce;
        var friction = data[0].Friction;
        var force = data[0].force;
        
        var Checkid = data[0].ID;
        var sentCount = data[0].sentCount;
        var type = data[0].Type;
        var connection = data[0].connections
        var color = data[0].color
        if (userExists(elements,Checkid)) {
            // var id = UniqueID();
        }else{
            var id = data[0].ID;

            if (type === 'tri') {
                var t = new triangles(x, y, r, bounce, friction, id, force, connection,color);
                elements.push(t);
                console.log(type);
            }else if (type === 'sqr') {
                var s = new squares(x, y, r, bounce, friction, id, force, connection,color);
                elements.push(s);
                console.log(type);
            }else if (type === 'circle'){
                var c = new circ(x, y, r, bounce, friction, id, force, connection,color);
                elements.push(c);
                console.log(type);
            }else{
                // console.log('?:'+type);
            }   
        }     
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
            var Checkid = data[0].ID;
            var sentCount = data[i].sentCount;
            var type = data[i].Type;
            var connection = data[i].connections
            var color = data[i].color
            if (userExists(elements,Checkid)) {
               var id = UniqueID();
               
            }else{
                var id = data[0].ID;
            }
            
        
            // var c = new circ(x, y, r, bounce, friction, id, force, connection,color);
            if (type === 'tri') {
                var t = new triangles(x, y, r, bounce, friction, id, force, connection,color);
                elements.push(t);
            }else if (type === 'sqr') {
                var s = new squares(x, y, r, bounce, friction, id, force, connection,color);
                elements.push(s);
            }else if (type === 'circle'){
                var c = new circ(x, y, r, bounce, friction, id, force, connection,color);
                elements.push(c);
            }else{
                // console.log(type);
            }
            // console.log(type);
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

window.mobilecheck = function() {
    var check = false;
    (function(a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

window.addEventListener('deviceorientation', function(event) {
    deviceOrientationEvent = event;
    updateGravity(event);
}, true);

window.onresize = function() {
    setTimeout(function() {
        canvas.size(windowWidth, windowHeight);
        fl.removeFromWorld();
        wallR.removeFromWorld();
        wallL.removeFromWorld();
        setTimeout(function() {
            fl = new Boundry(width / 2, height + (wallWidth / 2), 5000, wallWidth);
            wallR = new Boundry(width + (wallWidth / 2), height / 2, wallWidth, height + 1000);
            wallL = new Boundry(0 - (wallWidth / 2), height / 2, wallWidth, height + 1000);
        }, 200);
    }, 300);
}
function updateGravity(event) {
    // if (true) {
     
    // } else {
        engine.world.gravity.x = 0;
        if (debug) {
        engine.world.gravity.y = 1;
        }else{
        engine.world.gravity.y = 0;
        }
    // }
       // if (!engine) return;
       //  var orientation = window.orientation,
       //      gravity = engine.world.gravity;
       //  var orentationObj;
       //  if (orientation === 0) {
       //      gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
       //      gravity.y = Common.clamp(event.beta, -90, 90) / 90;
       //      orentationObj= {x:gravity.x,y:gravity.y};
       //  } else if (orientation === 180) {
       //      gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
       //      gravity.y = Common.clamp(-event.beta, -90, 90) / 90;
       //      orentationObj= {x:gravity.x,y:gravity.y};
       //  } else if (orientation === 90) {
       //      gravity.x = Common.clamp(event.beta, -90, 90) / 90;
       //      gravity.y = Common.clamp(-event.gamma, -90, 90) / 90;
       //      orentationObj= {x:gravity.x,y:gravity.y};
       //  } else if (orientation === -90) {
       //      gravity.x = Common.clamp(-event.beta, -90, 90) / 90;
       //      gravity.y = Common.clamp(event.gamma, -90, 90) / 90;
       //      orentationObj= {x:gravity.x,y:gravity.y};
       //  }
       //  // $('#texteds').html(orentationObj.x * 100)
       //  for (var i = 0; i < elements.length; i++) {
       //      elements[i].shadowUpdate(orentationObj);
       //  }
        
};


function UniqueID() { return '_' + Math.random().toString(36).substr(2, 9); }

function pushCirc(bsX, bsY, bw, bounced, frictioned, elements, bh, id) {
    if (actv_btn === 'circle') {
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
    } 
}
var TouchDrawing;
function touchStarted(){
    startV = createVector(mouseX, mouseY);
    time = new Date().getMilliseconds();

    TouchDrawing = true
}

function touchEnded() {
    if (ShapesActive === true) {
        if (clickStopped) {
            var endV = createVector(mouseX, mouseY);
            var endTime = new Date().getMilliseconds();
            var bw = endV.x - startV.x
            var bh = endV.y - startV.y
            pushCirc(startV.x, startV.y, bw, bounced, frictioned, elements, bh, UniqueID());
        }
    }
    TouchDrawing = false
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


