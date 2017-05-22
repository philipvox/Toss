function UniqueID() { return '_' + Math.random().toString(36).substr(2, 9); }
var colls = ["#F44336","#E91E63","#FF1744","#F50057","#9C27B0","#D500F9","#651FFF","#2196F3","#3F51B5","#304FFE","#29B6F6","#00BCD4","#009688","#00E676","#1DE9B6","#8BC34A","#CDDC39","#FDD835","#FFC400","#FF9100","#FF3D00"];

var standColor = generateStupidColor();
var triColor = generateStupidColor();
var sqrColor = generateStupidColor();
 
function circ(x, y, r, bounce, friction, Id, force, connect,color) {
    var options = {
        friction: friction,
        restitution: bounce,
        plugin:{
            attractors: [],
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
    this.body.r = roundUp(r, .1);
    this.body.label = Id;
    this.label = Id;
    this.body.isText = false;
    this.r = roundUp(r, .1);
    this.OGcolor = standColor;
    this.stroke = false;
    this.static = false;
    this.strokeColor = 'black';
    this.type = 'circle';
    this.body.types = 'circle';
    this.connections = [];
    this.color = standColor;
    // this.xOff = this.body.r/3; 
    // this.yOff = this.body.r/3;
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
    this.shadowUpdate = function(tilted) {
        var tilt = tilted;
        this.scale = this.body.r/3;
        this.xOff = tilt.x * this.scale * 2;
        this.yOff = tilt.y * this.scale * 2;
    }
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
        } else { noStroke();
            drawingContext.shadowColor = 'rgba(0,0,0,.24)';
            drawingContext.shadowBlur = 30;
            drawingContext.shadowOffsetX = this.xOff;
            drawingContext.shadowOffsetY = this.yOff;
        }
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
            colorMode(RGB, 255, 255, 255, 1);
            stroke(0, 0, 0, 0.3);
            
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

function randomColor(generator){
    generator = generator || Math.random;
    return colls[Math.floor(generator()*colls.length)];
}


function generateStupidColor(generator){
    var noun1 = randomColor(generator);
    var output = ''+noun1+'';
    return output;
   
    
}