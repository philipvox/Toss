function mouseCon() {
    // Make Mouse
    this.cmouse = Mouse.create(canvas.elt);
    this.cmouse.pixelRatio = pixelDensity();
    var option = {
        mouse: this.cmouse
    }
    MouseMatter = MouseConstraint.create(engine, option);
    World.add(world, MouseMatter);
    // On Mouse Down Matter js
    Matter.Events.on(MouseMatter, "mousedown", function() {
        if (this.body != null) {
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].body.label === this.body.label) {
                    elStatic(StaticActive, this.body, elements, i);
                    elLinks(LinksActive, this.body, elements, i);
                    deletME(deleteActive, this.body, elements, i);
                    MakeSquare(LinksActive, this.body, elements, i)
                }
            }
             for (var i = 0; i < rope.length; i++) {
                if (rope[i].body.label === this.body.label) {
                    elStatic(StaticActive, this.body, rope, i);
                    deletME(deleteActive, this.body, rope, i);
                    RopePulled(this.body, rope, i);
                }
            }

            
        }
    });
}

function RopePulled(obj, rope, i) {
    if (obj.label == rope[i].body.label) {
        if (rope[i].Ropelast == true) {
            roppped(rope[i].body.position);
            LastRope = true;
            ropeEl = rope[i];
        }
    }
}
var RopeY;
var RopeX;
function roppped(data) {
        RopeY= data.y;
        RopeX = data.x;
}

function deletME(bool, Tbody, elements, i) {
    if (bool) {
        for (var x = 0; x < joints.length; x++) {
            if (joints[x].a.label != undefined) {
                if (Tbody.label == joints[x].a.label) {
                    joints[x].removeFromWorld();
                    joints.splice(x, 1);
                }
            }
            if (joints[x].b.label != undefined) {
                if (Tbody.label == joints[x].b.label) {
                    joints[x].removeFromWorld();
                    joints.splice(x, 1);
                }
            }
        }
        elements[i].removeFromWorld();
        elements.splice(i, 1);
    }
}

function elStatic(bool, Tbody, elements, i) {
    // set Static
    if (bool) {
        if (Tbody.isStatic == true) {
            Matter.Body.setStatic(Tbody, false)
            Matter.Body.setMass(Tbody, 1)
            elements[i].static = false;
            elements[i].stroke = false;
            elements[i].color = elements[i].OGcolor;
        } else {
            // elements[i].color = 'grey';
            elements[i].static = true;
            elements[i].stroke = true;
            elements[i].strokeColor = 'black';
            Matter.Body.setStatic(Tbody, true)
        }
    }
}
var obj = {}
var FirstEl;
function elLinks(bool, Tbody, elements, i) {
    if (bool === true) {
        if (objCount === 0) {
            if (Tbody) {
                 clickedObj = Tbody;
                FirstEl = elements[i];
                setColor(elements[i], elements[i].color, '#A5FF3D', true);
                obj = {a: clickedObj.label};
            }
        } else {
            if (Tbody) {
                clickedObj_Prev = Tbody;            
                setColor(elements[i], elements[i].color, '#A5FF3D', true);
                if ((clickedObj_Prev != clickedObj) && (clickedObj != clickedObj_Prev)) {
                        obj['b'] = clickedObj_Prev.label;
                        FirstEl.connections.push(obj);
                        elements[i].connections.push(obj);
                        obj = {};
                    if (Tbody.circleRadius) {
                        joints.push(new Constraint(clickedObj, clickedObj_Prev, (clickedObj.circleRadius + clickedObj_Prev.circleRadius)*1.5, stiff));
                    } else {
                        joints.push(new Constraint(clickedObj, clickedObj_Prev, clickedObj.height + clickedObj_Prev.height*1.5, stiff));
                    }
                }
            }
        }
        objCount++;
        if (objCount >= 2) {
            objCount = 0;
            FirstEl = '';
            $.each(elements, function(index) {
                setColor(elements[index], elements[index].color, false);
            });
        }
    }
}
var SquareCount = 0;
var squareMaker = [];
var prev;
var rightAng;
var dots =[];
var SPRcount = 0;
var countBylabel = {};
function MakeSquare(bool, Tbody, elements, i) {
   if (bool === true) {
        if (squareMaker.length != 0) {
            squareMaker.push(elements[i]);
            countBylabel = count(squareMaker, function(item) { return item.body.label })
            var equaled = allTrue(countBylabel);
        }else{
             squareMaker.push(elements[i]);

        }
        
        
    }
    
}
function allTrue(obj){
    if (obj != undefined) {
        var spr = [3,3,3,3]
        var tri = [2,2,2]
        var rect = [3,3,3,3,5,5]
        var keysArray = [];
        var keys = Object.keys(obj);
        var keysSorted = Object.values(obj).sort(function(a,b){return if (obj[a] != undefined)&&(obj[b] != undefined) {obj[a]-obj[b]}})
        for (var i = 0; i < keys.length; i++) {
            var val = obj[keys[i]];
            keysArray.push(val);
        }
        if (keysArray.equals(spr)) {
            // console.log('spr');
            dots.push(new dot(squareMaker, 'spr'));
            squareMaker =[];
        }
        if (keysArray.equals(tri)) {
            // console.log('tri');
            dots.push(new dot(squareMaker, 'tri'));
            squareMaker =[];
        }
        if (keysArray.equals(rect)) {
            // console.log('rect');
            dots.push(new dot(squareMaker, 'rect'));
            squareMaker =[];
        }
    }
}

function dot(arr, string) {
     var options = {
        friction: 1,
        restitution: 1,
        desity: .01 / 2
    }
    this.array = arr;
    this.Center = GetCenter(this.array);
    this.x = this.Center.x;
    this.y = this.Center.y;
    this.r = 2;
    this.body = Bodies.circle(this.x, this.y, this.r, options);
    this.body.isSensor = true;
    this.childern= [];
    this.childernlabels= [];
    this.body.label = 'centerBall';

    World.add(world, this.body);
    for (var i = 0; i < this.array.length; i++) {
        for (var  x= 0; x < elements.length; x++) {
            if (elements[x].body.label == this.array[i].body.label) {
                this.childern.push(elements[x]);
                this.childernlabels.push(elements[x].body.label);
                // console.log(elements[x]);
            }
        }
    }
    if (string == 'tri') {
        this.color = '#76FF03'
        // CollisionDetection(uniq_fast(this.childernlabels),'#76FF03')
        Engine.update(engine);
    }
    this.show = function() {
        this.Center = GetCenter(this.childern)
        this.x = this.Center.x;
        this.y = this.Center.y;
        var pos = this.body.position;
        var angle = this.body.angle;
        push();
            translate(this.x, this.y);
            rotate(angle);
            rectMode(CENTER);
            noStroke();
            fill('red');
            ellipse(0, 0, this.r * 2, this.r * 2);
        pop();
    }

    this.removeFromWorld = function() {
        World.remove(world, this.body);
    }

}
// function CollisionDetection(array, colors) {
//     var coll;
//     console.log(array);
//     for (var i = 0; i < array.length; i++) {
//          for (var v = 0; v < elements.length; v++) {
//             if (elements[v].body.label == array[i]) {
//                 var object = elements[v];
//                 object.color = colors;
//                 Events.on(engine, "collisionActive", function(el) {
//                     var oBody = object.body.label
//                     var Boddy = object
//                     var aBody = el.pairs[0].bodyA.label
//                     var bBody = el.pairs[0].bodyB.label
//                     for (i = 0; i < el.pairs.length; i++) {
//                         pair = el.pairs[i];
//                         console.log(pair);
//                         if (!(pair.bodyA.label === oBody || pair.bodyB.label === oBody)) {
//                           continue;
//                         }
//                         Matter.Events.trigger(Boddy.body, 'collision', { pair : pair });    
                        
//                     }

//                 });

//             }
            
//         }
        
//         // var Boddy = object.body
//         Matter.Events.on(Boddy.body, 'collision', function(e) {
//          if (e.pair.bodyA.label  != "Rectangle Body" ){
//             if (e.pair.bodyB.label  != Boddy.label){
//                 if (Boddy === e.pair.bodyA.label) {

//                 }
//                 console.log('A:' + e.pair.bodyA.label);
//                 console.log('B:' + e.pair.bodyB.label);
//                 console.log('Boddy:' + Boddy.label);
//             }
//          }
         
//         });
//     }
// }
// var checker = true;    
// function actionOnGroup(coll,color) {
//     for (var d = 0; d < elements.length; d++) {
//         if (coll == elements[d].body.label) {
//             // if (checker) {
//                 var ob = elements[d];
//                 ob.color = color;
//                 // ob.r = ob.r/2;
//                 // ob.body.circleRadius = ob.body.circleRadius/2;
//                 // console.log(checker);
//             // }
//             // multiplyShapes(ob.body.position,ob.body.friction,ob.body.restitution,ob.r);
//         }
//         // checker = true;
//     }

//     // checker = true;
// }
function multiplyShapes(pos,friction,bounce, r) {
    x = pos.x
    y = pos.y
    bounce = bounce;
    friction = friction;
    elements.push(new circ(x, y, r, bounce, friction, UniqueID()) )

}
count = function(ary, classifier) {
    return ary.reduce(function(counter, item) {
        var p = (classifier || String)(item);
        counter[p] = counter.hasOwnProperty(p) ? counter[p] + 1 : 1;
        return counter;
    }, {})
}
function GetCenter(array) {
    var totalX = 0, totalY = 0;
    for (var i = 0; i < array.length; i++) {
        var p = array[i].body.position
        totalX += p.x;
        totalY += p.y;
    }
    var centerX = totalX / array.length;
    var centerY = totalY / array.length;
    return {x:centerX ,y:centerY};
}
function angleDeg(p1,p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

function threeDeg(p1,p2,p3) {
    var p12 = Math.sqrt(Math.pow((p1.x - p2.x),2) + Math.pow((p1.y - p2.y),2));
    var p13 = Math.sqrt(Math.pow((p1.x - p3.x),2) + Math.pow((p1.y - p3.y),2));
    var p23 = Math.sqrt(Math.pow((p2.x - p3.x),2) + Math.pow((p2.y - p3.y),2));

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
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
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

function circ(x, y, r, bounce, friction, Id, force, connect) {
    var options = {
        friction: friction,
        restitution: bounce,
        desity: .01 / r
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
         // console.log(connect);
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
            } else {noStroke();}
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

function Constraint(BodyA, BodyB, L, S) {
    this.a = BodyA;
    this.b = BodyB;
    this.l = L;
    this.s = S;
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

function headersReplace(input, replace, replacer) {
    if (input.includes(replace)) {
        return input.replace(replace, replacer);
    } else {
        return input
    }
}
function inrange(val, small, big) {
    if ((val >= small) && (val <= big)) {
        return true;
    } else {
        return false;
    }
}

if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

Array.prototype.giveBack = function ( needle, propOne, propTwo) {
   for (i in this) {
    if (propTwo) {
        if (this[i][propOne][propTwo] == needle) return this[i];
    }else{
       if (this[i] == needle) return this[i];
    }
   }
}
Array.prototype.contains = function ( needle, propOne, propTwo) {
   for (i in this) {
    if (propTwo) {
        if (this[i][propOne][propTwo] == needle) return true;
        else{
            return false
        }
    }else{
       if (this[i] == needle) return true;
       else{
        return false
       }
    }
   }
}
