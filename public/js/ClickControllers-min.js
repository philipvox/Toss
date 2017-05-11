var obj = {}
var FirstEl;

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
                    MakeSquare(LinksActive, this.body, elements, i);
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
            elements[i].strokeColor = 'black';
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
                setColor(elements[i], elements[i].color, '#A5FF3D', true);
                obj = { a: clickedObj.label };
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
                    if (clickedObj.isText == true && clickedObj_Prev.isText == true) {
                        console.log('both');
                        joints.push(new Constraint(clickedObj, clickedObj_Prev, (clickedObj.height + clickedObj_Prev.height ), stiff, UniqueID()));
                    }else if (clickedObj.isText == true && clickedObj_Prev.isText == false) {
                        console.log('first');
                        joints.push(new Constraint(clickedObj, clickedObj_Prev, (clickedObj.height + clickedObj_Prev.circleRadius ), stiff, UniqueID()));
                    }else if (clickedObj.isText == false && clickedObj_Prev.isText == true) {
                        console.log('second');
                        joints.push(new Constraint(clickedObj, clickedObj_Prev, (clickedObj.circleRadius + clickedObj_Prev.height ), stiff, UniqueID()));
                    }else{
                         if (Tbody.circleRadius) {
                            console.log('circs');
                            joints.push(new Constraint(clickedObj, clickedObj_Prev, (clickedObj.circleRadius + clickedObj_Prev.circleRadius) * 1.5, stiff, UniqueID()));
                        } 
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

