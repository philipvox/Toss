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
            dots.push(new dot(squareMaker, 'spr'));
            squareMaker = [];
        }
        if (keysArray.equals(tri)) {
            // console.log('tri');
            dots.push(new dot(squareMaker, 'tri'));
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
        desity: .01 / 2
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
    // console.log(this.childern);
    
    if (string == 'tri') {
        this.color = '#76FF03'
        CollisionDetection(this.childern,'#76FF03')
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
function CollisionDetection(array, colors) {
    Matter.Events.on(engine, 'collisionEnd', function(e) {
        for (var i = 0; i < array.length; i++) {
            var colObj;
            colObj = array[i];
            colObj.color = colors;
            for (x = 0; x < e.pairs.length; x++) {
                var oBody = colObj.body.label
                var aBody = e.pairs[x].bodyA.label
                var bBody = e.pairs[x].bodyB.label
                pair = e.pairs[x];
                if (!(aBody === oBody || bBody === oBody)) {
                    continue;
                }
                if (bBody != "Rectangle Body") {
                        if (bBody != oBody) {
                            console.log('A:' + aBody);
                            console.log('B:' + bBody);
                            console.log('Boddy:' + oBody);
                            for (var s = 0; s < elements.length; s++) {
                                if (elements[s].body.label == bBody) {
                                    for (var m = 0; m < array.length; m++) {
                                        if (elements[s].body.label != array[m].body.label) {
                                            elements[s].color = colors;
                                        }
                                    }
                                }
                            }
                        }
                    }
              }
            }  
    });
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