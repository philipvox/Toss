function UniqueID() { return '_' + Math.random().toString(36).substr(2, 9); }
var standColor = '#'+string_to_color(UniqueID());

function circ(x, y, r, bounce, friction, Id, force, connect,color) {
    var options = {
        friction: friction,
        restitution: bounce,
        plugin: {
          wrap: {
            min: {
              x: 0,
              y: 0 - 100
            },
            max: {
              x: canvas.width,
              y: canvas.height 
            }
          }
        }
    }
    if (r > 1) {
        r = r
    }else{
        r = 1
    }
    this.body = Bodies.circle(x, y, roundUp(r, .1), options);
    World.add(world, this.body)
    this.body.label = Id;
    this.label = Id;
    this.body.isText = false;
    this.r = roundUp(r, .1);
    this.OGcolor = standColor;
    this.stroke = false;
    this.static = false;
    this.strokeColor = 'black';
    this.type = 'circle';
    this.connections = [];
    this.color = standColor;

    if (color) {
        this.color = color;
    }
    if (connect) {
        this.connections = connect;
    }
    if (force) {
        Matter.Body.applyForce(this.body, this.body.position, force)
    }
    if (this.static) {
        this.body.isStatic = true;
    }

    this.Ropelast;
    this.RopeFirst;
    this.show = function() {
        var pos = this.body.position;
        var angle = this.body.angle;
        this.body.velocity.x = Matter.Common.clamp(this.body.velocity.x, -18, 18)
        this.body.velocity.y = Matter.Common.clamp(this.body.velocity.y, -18, 18)
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        if (this.stroke) {
            stroke(this.strokeColor);
            strokeWeight(3);
        } else { noStroke(); }
        fill(this.color);
        ellipse(0, 0, this.r * 2, this.r * 2);
        pop();

        if (this.static) {
            var pos = this.body.position;
            var angle = this.body.angle;
            push();
            translate(pos.x, pos.y);
            rotate(angle);
            rectMode(CENTER);
            stroke('#000');
            noFill();
            ellipse(0, 0, (this.r * 2) / 3, (this.r * 2) / 3);
            pop();
        }
    }
    this.removeFromWorld = function() {
        World.remove(world, this.body);
    }
}
function textDynamic(content,x, y, w,h, fontsize, bounce, friction, Id, force, connect) {
    var options = {
        friction: friction,
        restitution: bounce,
    }
    this.body = Bodies.rectangle(x, y, w, h, options);
    World.add(world, this.body)
    this.body.label = Id;
    this.body.height = h;
    this.body.width = w;
    this.body.isText = true;
    this.w = w;
    this.h = h;
    this.text = content;
    this.color = "#B0BEC5";
    this.OGcolor = "#B0BEC5";
    this.stroke = false;
    this.static = false;
    this.strokeColor = 'black';
    this.type = 'type';
    this.connections = [];
    if (connect) {
        this.connections = connect;
    }
    if (force) {
        Matter.Body.applyForce(this.body, this.body.position, force)
    }
    if (this.static) {
        this.body.isStatic = true;
    }
    this.show = function() {
        var pos = this.body.position;
        var angle = this.body.angle;
        this.body.velocity.x = Matter.Common.clamp(this.body.velocity.x, -18, 18)
        this.body.velocity.y = Matter.Common.clamp(this.body.velocity.y, -18, 18)
        push();
            translate(pos.x , pos.y);
            rotate(angle);
            if (this.stroke) {
                stroke(this.strokeColor);
                strokeWeight(3);
            } else {
                noStroke();
            }
            fill(this.color);
            textSize(fontsize);
            textLeading(0);
            textAlign(CENTER);
            text(this.text, 0, 10);
        pop();

        if (this.static) {
            // var pos = this.body.position;
            // var angle = this.body.angle;
            // push();
            //     translate(pos.x, pos.y);
            //     rotate(angle);
            //     rectMode(CENTER);
            //     stroke('#000');
            //     noFill();
            //     fill(this.color);
            //     textSize(24);
            //     textAlign(CENTER);
            //     text(this.text, 0, 0);
            // pop();
        }
    }
    this.removeFromWorld = function() {
        World.remove(world, this.body);
    }
}
function Boundry(x, y, w, h) {
    var options = {
        isStatic: true
    }
    this.body = Bodies.rectangle(x, y, w, h, options);
    this.body.density = 100;
    World.add(world, this.body);
    this.w = w;
    this.h = h;
    this.show = function() {
        var pos = this.body.position;
        push();
        translate(pos.x, pos.y);
        rectMode(CENTER);
        noStroke();
        fill('#263238');
        rect(0, 0, this.w, this.h)
        pop();
    }
    this.removeFromWorld = function() {
        World.remove(world, this.body);
    }
}

function Constraint(BodyA, BodyB, L, S, label) {
    this.a = BodyA;
    this.b = BodyB;
    this.l = L;
    this.s = S;
    this.label = label;
    var options = {
        bodyA: this.a,
        bodyB: this.b,
        length: this.l,
        stiffness: this.s
    }
    this.cons = Cons.create(options);
    World.add(world, this.cons);
    this.show = function() {
        var posA = BodyA.position;
        var posB = BodyB.position;
        push();
        noStroke();
        fill('#B0BEC5')
        var count = 15;
        for (var i = 0; i < count; i++) {
            var x = lerp(posA.x, posB.x, i / count);
            var y = lerp(posA.y, posB.y, i / count);
            ellipse(x, y, 4, 4);
        }
        pop();
    }
    this.removeFromWorld = function() {
        World.remove(world, this.cons);
    }
}

function string_to_color(str, prc) {
    'use strict';

    // Check for optional lightness/darkness
    var prc = typeof prc === 'number' ? prc : -10;

    // Generate a Hash for the String
    var hash = function(word) {
        var h = 0;
        for (var i = 0; i < word.length; i++) {
            h = word.charCodeAt(i) + ((h << 5) - h);
        }
        return h;
    };

    // Change the darkness or lightness
    var shade = function(color, prc) {
        var num = parseInt(color, 16),
            amt = Math.round(2.55 * prc),
            R = (num >> 16) + amt,
            G = (num >> 8 & 0x00FF) + amt,
            B = (num & 0x0000FF) + amt;
        return (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16)
            .slice(1);
    };

    // Convert init to an RGBA
    var int_to_rgba = function(i) {
        var color = ((i >> 24) & 0xFF).toString(16) +
            ((i >> 16) & 0xFF).toString(16) +
            ((i >> 8) & 0xFF).toString(16) +
            (i & 0xFF).toString(16);
        return color;
    };

    return shade(int_to_rgba(hash(str)), prc);

}
function Acheivments(argument) {
    this.ballCount = 0;
    this.jointCount = 0;
    this.shapesbuilt = 0;
    this.countBalls = function() {
        // body...
    }
    this.jointCount = function() {
        // body...
    }
    this.ShapeCount = function() {
        // body...
    }
}