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

//Hammer JS
var drawEl = document.getElementById('shapes');
var linkel = document.getElementById('linked');
var staticEl = document.getElementById('statics');
var gravvityEl = document.getElementById('gravity');
var UsersEl = document.getElementById('users');
var deleteEL = document.getElementById('delete');
var DrawHammer = new Hammer(drawEl);
var GravityHammer = new Hammer(gravvityEl);
var LinkedHammer = new Hammer(linkel);
var StaticHammer = new Hammer(staticEl);
var UsersHammer = new Hammer(UsersEl);
var DeleteHammer = new Hammer(deleteEL);
//Triggers 
var ShapesActive = false;
var GravityActive = false;
var LinksActive = false;
var StaticActive = false;
var UserActive = false;
var deleteActive = false;
var mobileON = false;
var actv_btn = "circle";
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
var stiff = .3;
var JointConnectionDely = 250;
var objCount = 0;
var BallsOut = 0;
//Floor & Walls Left/Right
var fl;
var wallL;
var wallR;
var topfl;

var LastRope = false;
var ropeEl = {};
var RopeJoints = [];

p5.disableFriendlyErrors = true;
window.mobilecheck = function() {
    var check = false;
    (function(a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};
engine = Engine.create();
world = engine.world;
var rope = [];
Matter.use(
        'matter-collision-events'
    );
function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('myContainer');
    Engine.run(engine);
    socket = io.connect();
    socket.on('balls', InitDrawing);
    socket.on('clients', userUpdate);
    socket.on('Ropedata', GetRopes);
    fl = new Boundry(width / 2, height + (wallWidth / 2), width, wallWidth);
    wallR = new Boundry(width + (wallWidth / 2), height / 2, wallWidth, height + 1000);
    wallL = new Boundry(0 - (wallWidth / 2), height / 2, wallWidth, height + 1000);
    topfl = new Boundry(width / 2, 0 - (wallWidth / 2), width, wallWidth);
    mouseCon();
    // colCheck();
    // MakeRope(4,40,100);
    mobileON = mobilecheck();
    

}
function MakeRope(counts, scale, RopeLength) {
    var prev;
    var count = 0;
    var ropeCount = counts;
    var RopeScale = scale;
    for (var x = 1; x < ropeCount; x++) {
        if (x >= ropeCount - 1) {
            var p = new circ(width / 2, x * RopeScale, 30, bounced, frictioned, UniqueID())
            p.Ropelast = true;
            var len =  RopeLength + 30;
        }else{
            if (!prev) {
                 var p = new circ(width / 2, 0, 5, bounced, frictioned, UniqueID())
            }else{
                 var p = new circ(width / 2, x * RopeScale, 5, bounced, frictioned, UniqueID())
             }
            p.Ropelast = true;
            var len = RopeLength + 5;
        }
        rope.push(p);
        count ++;
        if (!prev) {
            Matter.Body.setStatic(p.body, true)
            p.RopeFirst = true;
            p.Ropelast = false;
        }
        if (prev) {
            RopeJoints.push( new Constraint( p.body, prev.body,  len, 1));
        }
        prev = p
    }
}
function draw() {
    background('#ECEFF1');

    for (var i = 0; i < joints.length; i++) {
        joints[i].show();
        jointRemover(i);
    }
    for (var i = 0; i < RopeJoints.length; i++) {
        RopeJoints[i].show();
    }
    for (var i = 0; i < elements.length; i++) {
        elements[i].show();
        var y = elements[i].body.position.y;
        var x = elements[i].body.position.x;
        var force = Matter.Vector.div(Matter.Vector.mult(elements[i].body.velocity, -1), 400);
        SendBallConstructor(elements, i, x, y, force);
    }
    for (var i = 0; i < dots.length; i++) {
        dots[i].show();
    }
    // for (var i = 0; i < rope.length; i++) {
    //     rope[i].show();
    // }
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
    Engine.update(engine);
}

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
            fl = new Boundry(width / 2, height + (wallWidth / 2), width, wallWidth);
            wallR = new Boundry(width + (wallWidth / 2), height / 2, wallWidth, height + 1000);
            wallL = new Boundry(0 - (wallWidth / 2), height / 2, wallWidth, height + 1000);
        }, 200);
    }, 300);
}

function jointRemover(j) {
    var aPosY = joints[j].a.position.y, 
        aVelY = joints[j].a.velocity.y,
        bPosY = joints[j].b.position.y,
        bVelY = joints[j].b.velocity.y;

    if (((aPosY< -10) && (aVelY < 0)) || ((bPosY < -10) && (bVelY < 0))){
        joints[j].removeFromWorld();
        joints.splice(j, 1);
    }
}

setInterval(function() {
    BallsOut = 0;
}, 300);

function SendBallConstructor(elements, i, x, y, force) {
    if ((y < -10) && (elements[i].body.velocity.y < 0)) {
        
        BallsOut++;

        var ConnectionA;
        var ConnectionB;
        // console.log(elements[i].connections);
        for (var j = 0; j < joints.length; j++) {
            if (elements[i].body.label == joints[j].a.label) {
                ConnectionB = joints[j].b.label;
            }
            if (elements[i].body.label == joints[j].b.label) {
                ConnectionA = joints[j].a.label;
            }
        }

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
            connectionsA: ConnectionA,
            connectionsB: ConnectionB,
            force: force,
            sentCount: BallsOut
        };

        elements[i].removeFromWorld();
        elements.splice(i, 1);

        if (Object.keys(ActiveUser).length === 0) {
            socket.emit('balls', ball, MyName);
        } else {
            for (var i = 0; i < Object.keys(ActiveUser).length; i++) {
                socket.emit('balls', ball, Object.keys(ActiveUser)[i]);
            }
        }

    }
}

function InitDrawing(data) {
    var x = data.x;
    var y = data.y;
    var r = data.CRadius;
    var w = data.w;
    var h = data.h;
    var bounce = data.Bounce;
    var friction = data.Friction;
    var force = data.force;
    var id = data.ID;
    var ConnectionA = data.connectionsA;
    var ConnectionB = data.connectionsB;
    var sentCount = data.sentCount;
    var type = data.Type;
    var connection = data.connections
    if (type == 'box') {
        elements.push(new Box(x, y, w, h, bounce, friction, id, force, connection));
    } else {
        var c = new circ(x, y, r, bounce, friction, id, force, connection);
        elements.push(c);
        console.log(c);
    }
    JointConnectionDely = 230;
    // InitJoints(id, ConnectionA, ConnectionB, type, connection);
    superJoin(connection,type);
}

// function InitJoints(ID, ConnectionA, ConnectionB, type, Connections) {
//     // setTimeout(function() {
//         // AppenedNewJoint(ConnectionA, ConnectionA, ID, type);
//         // AppenedNewJoint(ConnectionB, ID, ConnectionB, type);
//         // superJoin(Connections,type);
//     // }, JointConnectionDely);
// }
function superJoin(Connections,type) {
    var first,
        second;
    setTimeout(function() {
        for (var f = 0; f < elements.length; f++) {
            for (var i = 0; i < Connections.length; i++) {
                    if (elements[f].body.label == Connections[i].a) {
                        var first = elements[f].body;
                    }
                    if (elements[f].body.label == Connections[i].b) {
                        var second = elements[f].body;
                        if (first != undefined) {
                            if (second != undefined) {
                                if (type == "box") {
                                    joints.push(new Constraint(first, second, first.h, stiff));
                                } else {
                                    joints.push(new Constraint(first, second, first.circleRadius + second.circleRadius * 1.5, stiff));
                                }
                            }
                        }
                    
                }
            }
        }
    }, 500);
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
VertexDrawing = false;
function touchStarted(){
    startV = createVector(mouseX, mouseY);
    time = new Date().getMilliseconds();
    if (VertexDrawing == true){

    }
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

function touchMoved() {
    RopePullSend();
}

function DrawingSelected() {
    if (ShapesActive === true) {
        var bsX = startV.x
        var bsY = startV.y
        var bw = roundUp(mouseX - startV.x, .1)
        var bh = roundUp(mouseY - startV.y, .1)

        push();
        rectMode(CENTER);
        stroke('blue');
        noFill();
        if (actv_btn === 'square') {
            rect(startV.x, startV.y, bw, bh);
        } else if (actv_btn === 'circle') {
            ellipse(startV.x, startV.y, bw * 2, bw * 2);
        } else if (actv_btn === 'poly') {
            rect(startV.x, startV.y, bw, bh);
        } else if (actv_btn === 'emoji') {
            ellipse(startV.x, startV.y, bw * 2, bw * 2);
        } else if (actv_btn === 'text_btn') {
            rect(startV.x, startV.y, bw, bh);
        }
        pop();
    }
}
function buttonClicker(bool, Mainlink, MImage, Removelink, RemoveImage, RemoveBool) {
    if (bool === false) {
        bool = true;
        RemoveBool = false;
        deleteActive = false;
        $(Mainlink).children('img').attr('src', 'img/NewIcons/' + MImage + '_C.svg');
        $(Removelink).children('img').attr('src', 'img/NewIcons/' + RemoveImage + '.svg');
        $('#delete').children('img').attr('src', 'img/NewIcons/delete.svg');
        Engine.update(engine);
    } else {
        bool = false;
        $(Mainlink).children('img').attr('src', 'img/NewIcons/' + MImage + '.svg');
        Engine.update(engine);
    }
    return { one: bool, two: RemoveBool }
}
LinkedHammer.on("tap", function(ev) {
    if (LinksActive === false) {
        $('.slideOption').removeClass('slideout');
        $('.slideOption').children('div').hide();
        Engine.update(engine);
    } else {
        $('#linked').children('img').attr('src', 'img/NewIcons/l.svg');
        objCount = 0;
        $.each(elements, function(index) {
            elements[index].stroke = false;
        });
        squareMaker = [];
        Engine.update(engine);
    }
    var Tapped = buttonClicker(LinksActive, '#linked', 'l', '#shapes', 'd', ShapesActive);
    LinksActive = Tapped.one;
    ShapesActive = Tapped.two;
});
DrawHammer.on("tap", function(ev) {
    // if (ShapesActive === false) {
    //     $('.slideOption').addClass('slideout');
    //     setTimeout(function() {
    //         $('.slideOption').children('div').show();
    //     }, 150);
    // } else {
    //     $('.slideOption').removeClass('slideout');
    //     $('.slideOption').children('div').hide();
    // }
    var Tapped = buttonClicker(ShapesActive, '#shapes', 'd', '#linked', 'l', LinksActive);
    ShapesActive = Tapped.one;
    LinksActive = Tapped.two;
});
GravityHammer.on("tap", function(ev) {
    var Tapped = buttonClicker(GravityActive, '#gravity', 'g');
    GravityActive = Tapped.one;
});
StaticHammer.on("tap", function(ev) {
    var Tapped = buttonClicker(StaticActive, '#statics', 's');
    StaticActive = Tapped.one;
});
UsersHammer.on("tap", function(ev) {
    if (UserActive === false) {
        $('.userlist').addClass('userlist-on');
    } else {
        $('.userlist').removeClass('userlist-on');
    }
    var Tapped = buttonClicker(UserActive, '#users', 'u');
    UserActive = Tapped.one;
});
DeleteHammer.on("tap", function(ev) {
    if (deleteActive === false) {
        deleteActive = true;
        ShapesActive = false;
        $('#shapes').children('img').attr('src', 'img/NewIcons/d.svg');
        $('.slideOption').removeClass('slideout');
        $('.slideOption').children('div').hide();
        $('#delete').children('img').attr('src', 'img/NewIcons/delete_C.svg');
        Engine.update(engine);
    } else {
        deleteActive = false;
        $('#delete').children('img').attr('src', 'img/NewIcons/delete.svg');
        Engine.update(engine);
    }
});
$('.buttns').children().click(function() {
    var content = $(this).parent().attr('data-content');
    var dataOff = $(this).parent().attr('data-off');
    $(this).siblings().parent().attr('data-off', 'off');
    if (dataOff == 'off') {
        $(this).parent().attr('data-off', 'on')
        dataOff = $(this).parent().attr('data-off');
    } else {
        $(this).parent().attr('data-off', 'off');
        dataOff = $(this).parent().attr('data-off');
    }
    $('.toggleInfo').html(content + dataOff);
    $('.toggleInfo').addClass('showtog');
    setTimeout(function() {
        $('.toggleInfo').removeClass('showtog');
    }, 400);
});
$('.slideOption').children('div').click(function(event) {
    actv_btn = event.target.id.toString();
    $(this).addClass('active');
    $(this).siblings().removeClass('active');
});

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


