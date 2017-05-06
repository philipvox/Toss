function GetRopes(data) {
    console.log(data.dist/2);
    for (var i = 0; i < rope.length; i++) {
        if (rope[i].RopeFirst === true) {
                rope[i].body.position.y = data.dist/2;
            
        }
    }
}
function RopePullSend() {
    if (LastRope) {
        var y = ropeEl.body.position.y;
        var x = ropeEl.body.position.x;

        var force = Matter.Vector.div(Matter.Vector.mult(ropeEl.body.velocity, 1));
        if (y > RopeY) {
            var distance = RopeY - y;
        }else{
            var distance = 0;
        }
        
        console.log(distance);
        var data = {
            x: x,
            y: y,
            vel: force,
            dist: distance
        }
        if (Object.keys(ActiveUser).length === 0) {
        } else {
            for (var i = 0; i < Object.keys(ActiveUser).length; i++) {
                socket.emit('ropeVal', data, Object.keys(ActiveUser)[i]);
            }
        }
        
    }else{
        
    }
}


function distSquared(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    return dx * dx + dy * dy;
}