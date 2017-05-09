
function circ(x, y, r, bounce, friction, Id, force, connect) {
    var options = {
        friction: friction,
        restitution: bounce,
        // density: .01 / r
    }
    this.body = Bodies.circle(x, y, roundUp(r, .1), options);
    World.add(world, this.body)
    this.body.label = Id;
    this.body.isText = false;
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


