var obj = {}
var FirstEl;
var oopsClick;
function mouseCon() {
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
            console.log(this.body);
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].body.label === this.body.label) {
                    elStatic(StaticActive, this.body, elements, i);
                    elLinks(LinksActive, this.body, elements, i);
                    deletME(deleteActive, this.body, elements, i);
                    MakeSquare(LinksActive, this.body, elements, i, oopsClick);
                }
            }
        }
    });
}

function deletME(bool, Tbody, elements, i) {
    if (bool) {
        for (var x = 0; x < joints.length; x++) {
            if (Tbody.label == joints[x].a.label || Tbody.label == joints[x].b.label) {
                joints[x].removeFromWorld();
                joints.splice(x, 1);
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
            // elements[i].strokeColor = 'black';
            Matter.Body.setStatic(Tbody, true)
        }
    }
}

function elLinks(bool, Tbody, elements, i) {

    if (bool === true) {
        if (objCount === 0) {
            if (Tbody) {
                clickedObj = Tbody;
                FirstEl = elements[i];
                setColor(elements[i], elements[i].color, '#0000FF', true);
                obj = { a: clickedObj.label };
            }else{
                objCount = 0;
                FirstEl = '';
            }
        } else {
            if (Tbody) {
                clickedObj_Prev = Tbody;
                setColor(elements[i], elements[i].color, '#0000FF', true);
                // console.log(bodyexistes(elements,clickedObj.label));
                oopsClick = bodyexistes(elements,clickedObj.label)
                if(oopsClick){
                    if ((clickedObj_Prev != clickedObj) && (clickedObj != clickedObj_Prev)) {
                        obj['b'] = clickedObj_Prev.label;
                        FirstEl.connections.push(obj);
                        elements[i].connections.push(obj);
                        setTimeout(function() {
                            $.each(elements, function(index) {
                                setColor(elements[index], elements[index].color, false);
                            });
                        }, 350);
                        obj = {};
                        if (Tbody.r) {
                            joints.push(new Constraint(clickedObj, clickedObj_Prev, (clickedObj.r + clickedObj_Prev.r) * 2, stiff, UniqueID()));
                        } 
                    }else{
                        $.each(elements, function(index) {
                            setColor(elements[index], elements[index].color, false);
                        });
                    }
                }

            }
        }
        objCount++;
        if (objCount >= 2) {
            objCount = 0;
            FirstEl = '';
            
        }
    }
}
function bodyexistes(arr,newlabel) {
  return arr.some(function(el) {
    return el.body.label === newlabel;    
  }); 
}

// if (clickedObj.types != 'circle' && clickedObj_Prev.types != 'circle') {
//     console.log('both');
//     joints.push(new Constraint(clickedObj, clickedObj_Prev, (clickedObj.r + clickedObj_Prev.r ), stiff, UniqueID()));
// }else if (clickedObj.types != 'circle' && clickedObj_Prev.types == 'circle') {
//     console.log('first');
//     joints.push(new Constraint(clickedObj, clickedObj_Prev, (clickedObj.r + clickedObj_Prev.r ), stiff, UniqueID()));
// }else if (clickedObj.types == 'circle' && clickedObj_Prev.types != 'circle') {
//     console.log('second');
//     joints.push(new Constraint(clickedObj, clickedObj_Prev, (clickedObj.r + clickedObj_Prev.r ), stiff, UniqueID()));
// }else{
//      if (Tbody.circleRadius) {
//         joints.push(new Constraint(clickedObj, clickedObj_Prev, (clickedObj.r + clickedObj_Prev.r) * 1.5, stiff, UniqueID()));
//     } 
// }

