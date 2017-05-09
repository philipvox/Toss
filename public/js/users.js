var socket = io.connect();
var MyName = '';
//Hammer JS
var drawEl = document.getElementById('shapes');
var linkel = document.getElementById('linked');
var staticEl = document.getElementById('statics');
var gravvityEl = document.getElementById('gravity');
var UsersEl = document.getElementById('users');
var deleteEL = document.getElementById('delete');
var TextEL = document.getElementById('text');
var DrawHammer = new Hammer(drawEl);
var GravityHammer = new Hammer(gravvityEl);
var LinkedHammer = new Hammer(linkel);
var StaticHammer = new Hammer(staticEl);
var UsersHammer = new Hammer(UsersEl);
var DeleteHammer = new Hammer(deleteEL);
var TextHammer = new Hammer(TextEL);
//Triggers 
var ShapesActive = false;
var GravityActive = false;
var LinksActive = false;
var StaticActive = false;
var UserActive = false;
var deleteActive = false;
var mobileON = false;
var TextActive = false;
var actv_btn = "circle";

$("#Usernames").submit(function(event) {
    event.preventDefault();
    var value = $('#naming').val();
    MyName = $('#naming').val();
    // console.log(value);
    socket.emit('add-user', value, function(data) {
        if (data) {
            $('#Usernames').parent().hide();
            // console.log('hide')
        } else {
            $('#error').html('Username Taken');
            console.log('ERROR')
        }
    });
    $('#naming').val('');
    if (mobileON) {
        fullScreen();
    }
    return false;
});
var AllUsers = {};

function userUpdate(data) {
    $('.userlist').html('');
    var AllUsers = {};
    for (var i = 0; i < data.length; i++) {
        if (data[i] === MyName) {
            var a = $('<li data-id="' + data[i] + '" class="MyName"><span class="data-names">' + data[i] + '</span><div class="You">Yourself</div></li>');
            $('.userlist').prepend(a);
        } else {
            var a = $('<li data-id="' + data[i] + '" ><span class="data-names">' + data[i] + '</span><div class="addUser" >add</div></li>');
            $('.userlist').append(a);
        }
        if (data[i] in AllUsers) {
            delete AllUsers[data[i]];
        } else {
            if (data[i] != '') {
                AllUsers[data[i]] = data[i];
            }
        }
        for (var x = 0; x < Object.keys(ActiveUser).length; x++) {
            console.log(data[i]);
            if (Object.keys(ActiveUser)[x] != data[i]) {
                console.log(Object.keys(ActiveUser)[x]);
                delete ActiveUser[Object.keys(ActiveUser)[x]];
                AddToActiveList();
            }
        }
        a.on('click', function() {
            var thisID = $(this).children('span').html();
            if (thisID != MyName) {
                if ($(this).hasClass('UserSelected')) {
                    $(this).removeClass('UserSelected');
                    $(this).children('.addUser').html('add');
                } else {
                    $(this).addClass('UserSelected');
                    $(this).children('.addUser').html('remove');
                }
            }
            if (thisID in ActiveUser) {
                delete ActiveUser[thisID];
                AddToActiveList();
            } else {
                if (thisID != MyName) {
                    ActiveUser[thisID] = thisID;
                    AddToActiveList();
                }
            }

        });
    }
    // console.log(data);    
    socket.emit('updateActive', ActiveUser);
}

function AddToActiveList() {
    $('.Sending-userlist').html('');
    for (var i = 0; i < Object.keys(ActiveUser).length; i++) {
        if (MyName != Object.values(ActiveUser)[i]) {
            var active = Object.values(ActiveUser)[i];
            var visable = Object.values(ActiveUser)[i];
            var activeUserListMoreThanThree;
            var activeUserList;
            if (Object.keys(ActiveUser).length >= 3) {
                activeUserListMoreThanThree = $('<li class="actievCount" ><span data-id="' + active + '" class="data-names">' + Object.keys(ActiveUser).length + ' active</span></li>');
                $('.Sending-userlist').html(activeUserListMoreThanThree);
                activeUserListMoreThanThree.on('click', function() {
                    if (UserActive === false) {
                        $('.userlist').addClass('userlist-on');
                    } else {
                        $('.userlist').removeClass('userlist-on');
                    }
                    var Tapped = buttonClicker(UserActive, '#users', 'u');
                    UserActive = Tapped.one;

                });
            } else {
                activeUserList = $('<li><span data-id="' + active + '" class="data-names">' + visable + '</span></li>');
                $('.Sending-userlist').append(activeUserList);
                activeUserList.on('click', function() {
                    var thisID = $(this).children('span').data('id');
                    if (thisID in ActiveUser) {
                        delete ActiveUser[thisID];
                        AddToActiveList();
                    }
                });
            }
        }
    }  
}

$(function() {
    $('#naming').on('keypress', function(e) {
        if (e.which == 32) return false;
    });
});


function DrawingSelected() {
    if (ShapesActive === true) {
        var bsX = startV.x
        var bsY = startV.y
        var bw = roundUp(mouseX - startV.x, .1)
        var bh = roundUp(mouseY - startV.y, .1)

        push();
        rectMode(CENTER);
        stroke('blue');
        noFill();
        if (actv_btn === 'square') {
            rect(startV.x, startV.y, bw, bh);
        } else if (actv_btn === 'circle') {
            ellipse(startV.x, startV.y, bw * 2, bw * 2);
        } else if (actv_btn === 'poly') {
            rect(startV.x, startV.y, bw, bh);
        } else if (actv_btn === 'emoji') {
            ellipse(startV.x, startV.y, bw * 2, bw * 2);
        } else if (actv_btn === 'text_btn') {
            rect(startV.x, startV.y, bw, bh);
        }
        pop();
    }
}
function buttonClicker(bool, Mainlink, MImage, Removelink, RemoveImage, RemoveBool) {
    if (bool === false) {
        bool = true;
        RemoveBool = false;
        deleteActive = false;
        $(Mainlink).children('img').attr('src', 'img/NewIcons/' + MImage + '_C.svg');
        $(Removelink).children('img').attr('src', 'img/NewIcons/' + RemoveImage + '.svg');
        $('#delete').children('img').attr('src', 'img/NewIcons/delete.svg');
        Engine.update(engine);
    } else {
        bool = false;
        $(Mainlink).children('img').attr('src', 'img/NewIcons/' + MImage + '.svg');
        Engine.update(engine);
    }
    return { one: bool, two: RemoveBool }
}
LinkedHammer.on("tap", function(ev) {
    if (LinksActive === false) {
        $('.slideOption').removeClass('slideout');
        $('.slideOption').children('div').hide();
        Engine.update(engine);
    } else {
        $('#linked').children('img').attr('src', 'img/NewIcons/l.svg');
        objCount = 0;
        $.each(elements, function(index) {
            elements[index].stroke = false;
        });
        squareMaker = [];
        Engine.update(engine);
    }
    var Tapped = buttonClicker(LinksActive, '#linked', 'l', '#shapes', 'd', ShapesActive);
    LinksActive = Tapped.one;
    ShapesActive = Tapped.two;
});
DrawHammer.on("tap", function(ev) {
    var Tapped = buttonClicker(ShapesActive, '#shapes', 'd', '#linked', 'l', LinksActive);
    ShapesActive = Tapped.one;
    LinksActive = Tapped.two;
});
GravityHammer.on("tap", function(ev) {
    var Tapped = buttonClicker(GravityActive, '#gravity', 'g');
    GravityActive = Tapped.one;
});
StaticHammer.on("tap", function(ev) {
    var Tapped = buttonClicker(StaticActive, '#statics', 's');
    StaticActive = Tapped.one;
});
UsersHammer.on("tap", function(ev) {
    if (UserActive === false) {
        $('.userlist').addClass('userlist-on');
    } else {
        $('.userlist').removeClass('userlist-on');
    }
    var Tapped = buttonClicker(UserActive, '#users', 'u');
    UserActive = Tapped.one;
});
DeleteHammer.on("tap", function(ev) {
    if (deleteActive === false) {
        deleteActive = true;
        ShapesActive = false;
        $('#shapes').children('img').attr('src', 'img/NewIcons/d.svg');
        $('.slideOption').removeClass('slideout');
        $('.slideOption').children('div').hide();
        $('#delete').children('img').attr('src', 'img/NewIcons/delete_C.svg');
        Engine.update(engine);
    } else {
        deleteActive = false;
        $('#delete').children('img').attr('src', 'img/NewIcons/delete.svg');
        Engine.update(engine);
    }
});
TextHammer.on("tap", function(ev) {
  
    var Tapped = buttonClicker(TextActive, '#text', 't');
    TextActive = Tapped.one;
});
$( "#text" ).click(function() {
    $("#texts").show();
    document.getElementById("textinput").focus();
});
$("#texts").submit(function(event) {
    event.preventDefault();
    var value = $('#textinput').val();
    console.log(value)
    var fontsize = 24;
    var text = value;
    var x = width/2;
    var y = height/2;
    var h = fontsize;
    var w = textWidth(value);
    console.log(fontsize);
    console.log(w*2);
    elements.push(new textDynamic(text,x, y, w*2,h, fontsize, bounced, frictioned,  UniqueID()));
    console.log('hello');
    var Tapped = buttonClicker(TextActive, '#text', 't');
    TextActive = Tapped.one;
    $('#textinput').val('');
    $("#texts").hide();
});
$('.buttns').children().click(function() {
    var content = $(this).parent().attr('data-content');
    var dataOff = $(this).parent().attr('data-off');
    $(this).siblings().parent().attr('data-off', 'off');
    if (dataOff == 'off') {
        $(this).parent().attr('data-off', 'on')
        dataOff = $(this).parent().attr('data-off');
    } else {
        $(this).parent().attr('data-off', 'off');
        dataOff = $(this).parent().attr('data-off');
    }
    $('.toggleInfo').html(content + dataOff);
    $('.toggleInfo').addClass('showtog');
    setTimeout(function() {
        $('.toggleInfo').removeClass('showtog');
    }, 400);
});
$('.slideOption').children('div').click(function(event) {
    actv_btn = event.target.id.toString();
    $(this).addClass('active');
    $(this).siblings().removeClass('active');
});