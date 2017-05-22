var SquareCount = 0;
var squareMaker = [];
var prev;
var rightAng;
var dots = [];
var SPRcount = 0;
var countBylabel = {};

function MakeSquare(bool, Tbody, elements, i) {
    if (bool === true) {
        if (squareMaker.length != 0) {
            squareMaker.push(elements[i]);
            countBylabel = count(squareMaker, function(item) { if (item.body != undefined) { return item.body.label } })
            var equaled = allTrue(countBylabel);
        } else {
            squareMaker.push(elements[i]);
        }
    }
}

function allTrue(obj) {
    if (obj != undefined) {
        // console.log(obj);
        var spr = [3, 3, 3, 3]
        var tri = [2, 2, 2]
        var rect = [3, 3, 3, 3, 5, 5]
        var keysArray = [];
        var keys = Object.keys(obj);
        // var keysSorted = Object.values(obj).sort(function(a,b){if (obj[a] != undefined && obj[b] != undefined) {return obj[a]-obj[b]}});
        for (var i = 0; i < keys.length; i++) {
            var val = obj[keys[i]];
            keysArray.push(val);
        }
        if (keysArray.equals(spr)) {
            // console.log('spr');
            var Vals = buildShapeObj(squareMaker);
            elements.push(new squares(Vals.x, Vals.y, Vals.r, bounced, frictioned, UniqueID()));
            squareMaker = [];
        }
        if (keysArray.equals(tri)) {
            // console.log('tri');
            var Vals = buildShapeObj(squareMaker);
            elements.push(new triangles(Vals.x, Vals.y, Vals.r, bounced, frictioned, UniqueID()));
            Engine.update(engine);
            squareMaker = [];
        }
        if (keysArray.equals(rect)) {
            // console.log('rect');
            dots.push(new dot(squareMaker, 'rect'));
            squareMaker = [];
        }
    }
}

function dot(arr, string) {
    var options = {
        friction: 1,
        restitution: 1,
        plugin:{
            attractors: [
              function(bodyA, bodyB) {
                return {
                  x: (bodyA.position.x - bodyB.position.x) * 5e-6,
                  y: (bodyA.position.y - bodyB.position.y) * 5e-6,
                };
              }
            ],
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
   
    this.array = arr;
    this.Center = GetCenter(this.array);
    this.x = this.Center.x;
    this.y = this.Center.y;
    this.r = 2;
    this.body = Bodies.circle(this.x, this.y, this.r, options);
    this.body.isSensor = true;
    this.childern = removeDuplicates(arr, 'body','label');
    this.childernlabels = [];
    this.body.label = 'centerBall';
    World.add(world, this.body);

    if (string == 'tri') {
        this.color = '#76FF03'
        CollisionDetection(this.childern,'#76FF03')
        Engine.update(engine);
    }
    if (string == 'spr') {
        Engine.update(engine);
        wallR.removeFromWorld();
        wallL.removeFromWorld();
    }
    Engine.update(engine);
    console.log(this.body.plugin)
    this.show = function() {
        this.Center = GetCenter(this.childern)
        this.x = this.Center.x;
        this.y = this.Center.y;
        this.body.position.x = this.x
        this.body.position.y = this.y
        var pos = this.body.position;
        var angle = this.body.angle;
        push();
            translate(this.x, this.y);
            rotate(angle);
            rectMode(CENTER);
            noStroke();
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

function UniqueID() { return '_' + Math.random().toString(36).substr(2, 9); }

function buildShapeObj(arr) {
    var xVal;
    var yVal;
    var rVal;
    var Center = GetCenter(arr);
    xVal = Center.x;
    yVal = Center.y;
    var childern = removeDuplicates(arr, 'body','label');
    for (var m = 0; m < childern.length; m++) {
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].body.label  == childern[m].body.label) {
                elements[i].removeFromWorld();
                elements.splice(i, 1);
            }
        }
    }
    rVal = Math.dist(arr[0].body.position.x, arr[1].body.position.x,arr[0].body.position.y, arr[1].body.position.y);
    return {x: xVal, y: yVal,r: rVal}
}

function triangles(x, y, r, bounce, friction, Id, force, connect,color) {
    // this.array = arr;
    var options = {
        friction: friction,
        restitution: bounce,
        plugin:{
            attractors: [
              function(bodyA, bodyB) {
                return {
                  x: (bodyA.position.x - bodyB.position.x) *  r/(10000000),
                  y: (bodyA.position.y - bodyB.position.y) * r/(10000000),
                };
              }
            ],
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
    this.x = x;
    this.y = y
    this.r = r;
    this.body = Bodies.polygon(this.x, this.y, 3, this.r, options);
    this.body.r = r;
    this.body.label = Id;
    this.color = triColor;
    this.OGcolor = triColor;
    this.stroke = false;
    this.static = false;
    this.strokeColor = 'black';
    this.type = 'tri';
    this.body.types = 'tri';
    this.connections = [];

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

    // this.childern = removeDuplicates(arr, 'body','label');
    
    World.add(world, this.body);
    Engine.update(engine);
    this.shadowUpdate = function(tilted) {
        var tilt = tilted;
        this.scale = this.body.r/3; 
        this.xOff = tilt.x * this.scale * 2;
        this.yOff = tilt.y * this.scale * 2;

    }
    this.show = function() {
        var pos = this.body.position;
        push();
            fill(this.color);
            if (this.stroke) {
                stroke(this.strokeColor);
                // strokeWeight(3);
            } else { 
                noStroke(); 
                drawingContext.shadowColor = 'rgba(0,0,0,.34)';
                drawingContext.shadowBlur = 30;
                drawingContext.shadowOffsetX = this.xOff;
                drawingContext.shadowOffsetY = this.yOff;
            }
            var x1 = this.body.vertices[0].x
            var y1 = this.body.vertices[0].y
            var x2 = this.body.vertices[1].x
            var y2 = this.body.vertices[1].y
            var x3 = this.body.vertices[2].x
            var y3 = this.body.vertices[2].y
            triangle(x1,y1,x2,y2,x3,y3);
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

function squares(x, y, r, bounce, friction, Id, force, connect,color) {
    var options = {
        friction: friction,
        restitution: bounce,
        plugin:{
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
    this.x = x;
    this.y = y
    this.r = r;
    this.body = Bodies.polygon(this.x, this.y, 4, this.r, options);
    this.body.r = r;
    this.body.label = Id;
    this.color = sqrColor;
    this.OGcolor = sqrColor;
    this.stroke = false;
    this.static = false;
    this.strokeColor = 'black';
    this.type = 'sqr';
    this.body.types = 'sqr';
    this.connections = [];

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
    World.add(world, this.body);
    wallR.removeFromWorld();
    wallL.removeFromWorld();
    Engine.update(engine);
    this.shadowUpdate = function(tilted) {
        var tilt = tilted;
        this.scale = this.body.r/3;
        this.xOff = tilt.x * this.scale * 2;
        this.yOff = tilt.y * this.scale * 2;
    }
    this.show = function() {
        var pos = this.body.position;
        push();
            fill(this.color);
            if (this.stroke) {
                stroke(this.strokeColor);
                strokeWeight(3);
            } else { 
                noStroke(); 
                drawingContext.shadowColor = 'rgba(0,0,0,.34)';
                drawingContext.shadowBlur = 30;
                drawingContext.shadowOffsetX = this.xOff;
                drawingContext.shadowOffsetY = this.yOff;
            }
            var x1 = this.body.vertices[0].x
            var y1 = this.body.vertices[0].y
            var x2 = this.body.vertices[1].x
            var y2 = this.body.vertices[1].y
            var x3 = this.body.vertices[2].x
            var y3 = this.body.vertices[2].y
            var x4 = this.body.vertices[3].x
            var y4 = this.body.vertices[3].y
            quad(x1,y1,x2,y2,x3,y3,x4,y4)
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

Math.dist=function(x1,x2,y1,y2){ 
  if(!x2) x2=0; 
  if(!y2) y2=0;
  return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)); 
}

function removeDuplicates(originalArray, objKey,label) {
  var trimmedArray = [];
  var values = [];
  var value;

  for(var i = 0; i < originalArray.length; i++) {
    value = originalArray[i][objKey][label];
    if(values.indexOf(value) === -1) {
      trimmedArray.push(originalArray[i]);
      values.push(value);
    }
  }

  return trimmedArray;

}
function removeDuplicates(originalArray, objKey,objKey2) {
  var trimmedArray = [];
  var values = [];
  var value;
  var value2;

  for(var i = 0; i < originalArray.length; i++) {
    value = originalArray[i][objKey];
    value2 = originalArray[i][objKey2];
    if(values.indexOf(value) === -1) {
        if(values.indexOf(value2) === -1) {
          trimmedArray.push(originalArray[i]);
          values.push(value);
      }
    }
  }

  return trimmedArray;

}
function CollisionDetection(array, colors) {
    Matter.Events.on(engine, 'collisionActive', function(e) {
        for (var i = 0; i < array.length; i++) {
            var colObj;
            colObj = array[i];
            colObj.color = colors;
            }  
    });
}

function notequalto(element, index, array, val) {
  return element >= val;
}
function ColDelete(bBody,array) {
    for (var s = 0; s < elements.length; s++) {
        if (elements[s].body.label == bBody) {
             elements[s].color = 'red';   
        }
    }
}
function actionOnGroup(coll, color) {
    for (var d = 0; d < elements.length; d++) {
        if (coll == elements[d].body.label) {
            var ob = elements[d];
            ob.color = color;
        }
     
    }
}

function multiplyShapes(pos, friction, bounce, r) {
    x = pos.x
    y = pos.y
    bounce = bounce;
    friction = friction;
    elements.push(new circ(x, y, r, bounce, friction, UniqueID()))
}

function GetCenter(array) {
    var totalX = 0,
        totalY = 0;
    for (var i = 0; i < array.length; i++) {
        var p = array[i].body.position
        totalX += p.x;
        totalY += p.y;
    }
    var centerX = totalX / array.length;
    var centerY = totalY / array.length;
    return { x: centerX, y: centerY };
}

