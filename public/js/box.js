
function circ(x, y, r, bounce, friction, Id, force, connect) {
    var options = {
        friction: friction,
        restitution: bounce,
        // density: .01 / r
    }
    this.body = Bodies.circle(x, y, roundUp(r, .1), options);
    World.add(world, this.body)
    this.body.label = Id;
    this.r = roundUp(r, .1);
    this.color = "#2962FF";
    this.OGcolor = "#2962FF";
    this.stroke = false;
    this.static = false;
    this.strokeColor = 'black';
    this.type = 'circle';
    this.connections = [];
    this.connectionsA = [];
    this.connectionsB = [];
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
    this.w = roundUp(w, .1);
    this.h = roundUp(h, .1);
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
            translate(pos.x, pos.y);
            rotate(angle);
            rectMode(CENTER);
            if (this.stroke) {
                stroke(this.strokeColor);
                strokeWeight(3);
            } else {
                noStroke();
            }
            // rect(0, 0, this.w, this.h)
            fill(this.color);
            textSize(fontsize);
            textAlign(CENTER);
            text(this.text, 0, 0);
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
                fill(this.color);
                // translate(width/2, height/2);
                textSize(24);
                textAlign(CENTER);
                text(value, 0, 0);
            pop();
        }
    }
    this.removeFromWorld = function() {
        World.remove(world, this.body);
    }
}
function Box(x, y, w, h, bounce, friction, Id, force) {
    var options = {
        friction: friction,
        restitution: bounce
    }
    this.body = Bodies.rectangle(x, y, w, h, options);
    this.body.label = Id;
    World.add(world, this.body)
    this.w = w;
    this.h = h;
    this.color = "#FF3D00";
    this.OGcolor = "#FF3D00";
    this.stroke = false;
    this.strokeColor = 'black';
    this.type = 'box';
    if (force) {
        Matter.Body.applyForce(this.body, this.body.position, force)
    }
    this.show = function() {
        var pos = this.body.position;
        var angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        if (this.stroke) {
            stroke(this.strokeColor);
            strokeWeight(3);
        } else {
            noStroke();
        }
        fill(this.color);
        rect(0, 0, this.w, this.h)
        pop();
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

function inrange(val, small, big) {
    if ((val >= small) && (val <= big)) {
        return true;
    } else {
        return false;
    }
}
if (Array.prototype.equals) console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
Array.prototype.equals = function(array) {
        if (!array) return false;
        if (this.length != array.length) return false;
        for (var i = 0, l = this.length; i < l; i++) {
            if (this[i] instanceof Array && array[i] instanceof Array) {
                if (!this[i].equals(array[i])) return false;
            } else if (this[i] != array[i]) {
                return false;
            }
        }
        return true;
    }
Object.defineProperty(Array.prototype, "equals", { enumerable: false });
Array.prototype.giveBack = function(needle, propOne, propTwo) {
    for (i in this) {
        if (propTwo) {
            if (this[i][propOne][propTwo] == needle) return this[i];
        } else {
            if (this[i] == needle) return this[i];
        }
    }
}
Array.prototype.contains = function(needle, propOne, propTwo) {
    for (i in this) {
        if (propTwo) {
            if (this[i][propOne][propTwo] == needle) return true;
            else {
                return false
            }
        } else {
            if (this[i] == needle) return true;
            else {
                return false
            }
        }
    }
}

count = function(ary, classifier) {
    return ary.reduce(function(counter, item) {
        if (item != undefined) {
            var p = (classifier || String)(item);
            counter[p] = counter.hasOwnProperty(p) ? counter[p] + 1 : 1;
            return counter;
        }
    }, {})
}

function angleDeg(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

function threeDeg(p1, p2, p3) {
    var p12 = Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
    var p13 = Math.sqrt(Math.pow((p1.x - p3.x), 2) + Math.pow((p1.y - p3.y), 2));
    var p23 = Math.sqrt(Math.pow((p2.x - p3.x), 2) + Math.pow((p2.y - p3.y), 2));
    //angle in radians
    var resultRadian = Math.acos(((Math.pow(p12, 2)) + (Math.pow(p13, 2)) - (Math.pow(p23, 2))) / (2 * p12 * p13));
    //angle in degrees
    return resultDegree = Math.acos(((Math.pow(p12, 2)) + (Math.pow(p13, 2)) - (Math.pow(p23, 2))) / (2 * p12 * p13)) * 180 / Math.PI;
}

function uniq_fast(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for (var i = 0; i < len; i++) {
        var item = a[i];
        if (seen[item] !== 1) {
            seen[item] = 1;
            out[j++] = item;
        }
    }
    return out;
}

function setColor(object, color, s, bool) {
    object.color = color;
    if (bool) {
        object.stroke = true;
        object.strokeColor = s;
    } else {
        object.stroke = false;
    }
}

function roundUp(num, precision) {
    return Math.ceil(num * precision) / precision
}