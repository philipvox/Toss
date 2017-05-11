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
        plugin:{
            attractors: [
              function(bodyA, bodyB) {
                return {
                  x: (bodyA.position.x - bodyB.position.x) * 5e-6,
                  y: (bodyA.position.y - bodyB.position.y) * 5e-6,
                };
              }
            ]
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
            
            // for (x = 0; x < e.pairs.length; x++) {
            //     var oBody = colObj.body.label
            //     var aBody = e.pairs[x].bodyA.label
            //     var bBody = e.pairs[x].bodyB.label
            //     pair = e.pairs[x];
            //     function aBodyCheck(e) {
            //         return e.body.label == aBody
            //     }
            //     function bBodyCheck(e) {
            //         return e.body.label == bBody
            //     }
            //     if (aBody != 'Rectangle Body') {
            //         if (bBody != 'Rectangle Body')  {
            //             var m = oBody == aBody;
            //             var b = oBody == bBody;
            //             if (oBody == aBody) {
            //                 if (bBody != oBody) {
            //                     console.log('abody'+oBody);
            //                 }
            //             }
            //             if (oBody == bBody) {
            //                 if (aBody != oBody) {
            //                     console.log('bbody'+oBody);
            //                 }
            //                 //do something to a body
                            
                            
            //             }
                        
                        
                        

            //             // console.log(bBody);
            //         }
                    
            //     }
                

            //   }
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