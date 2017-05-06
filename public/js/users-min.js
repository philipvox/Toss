var socket = io.connect();
var MyName = '';

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

