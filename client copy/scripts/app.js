// YOUR CODE HERE:
  // Our app
  var app = {
    server: '127.0.0.1:3000/classes/messages',
    init: function(){
      this.roomname = undefined;
      this.friends= {};
      this.username = window.location.search.slice(10);
      this.fetch();
      var self = this;
      setInterval(function() {
        // self.clearMessages.call(self);
        self.fetch.call(self);
      }, 5000);
    },
    send: function(message){
      var self = this;
      $.ajax({
        type: 'POST',
        url: this.server,
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function(data){
          //construct message object
          var messageObject = {
            //text
            text: message.text,
            //username
            username: self.username,
            //objectId
            objectId: data.objectId,
            //roomname
            roomname: self.roomname
          };
          //call addMessage with message  object as argument
          self.addMessage(messageObject);
          console.log(data);
          console.log('message sent');
        },
        error: function(){
          console.error('Error sending message');
        }
      });
    },
    fetch: function(){
      var self = this;
      $.ajax({
        type: 'GET',
        url: this.server,
        contentType: 'application/json',
        data: {order: '-createdAt'},
        success: function(data){
          self.renderMessages(data.results);
          var rooms = {};
          for (var i = 0; i < data.results.length; i++){
            rooms[data.results[i].roomname] = true;
          }
          var currentRooms = {};
          $("#roomSelect li").each(function(){
            currentRooms[$(this).text()] = true;
          });
          for (var key in rooms) {
            if (!currentRooms[key]){
              self.addRoom(key);
            }
          }
        },
        error: function(){
          console.error('Error: fetching messages');
        }

      });
    },
    addMessage: function(messageObject){

      var self = this;
      var $messages =  $('#chats');
      var $messageContainer = $('<li id="'+ messageObject.objectId +'" class="chat">');
      var $currentMessage = $('<span class="message">');
      if(this.friends[messageObject.username]){
        $currentMessage.addClass('friend');
      }
      var $username = $('<span class= "username">');
      $username.click(function(){
        var username = $(this).text();
        self.addFriend(username);
        $('.message').each(function(){
          if($(this).prev('.username').text() === username){
            $(this).addClass('friend');
          }
        });
      });
      $username.text(messageObject.username);
      $currentMessage.text(': ' + messageObject.text);
      $messageContainer.data("roomname", messageObject.roomname);
      if (messageObject.roomname !== this.roomname) {
        $messageContainer.hide();
      }
      $messageContainer.append($username);
      $messageContainer.append($currentMessage);
      $messages.prepend($messageContainer);

    },
    renderMessages: function(messageArray){
      var id = {};
      $('.chat').each(function(){
        id[$(this).attr('id')] = true;
      });
      for(var i = 0; i<messageArray.length; i++){
        if(!id[messageArray[i].objectId]){
          this.addMessage(messageArray[i]);
        }
      }
    },
    clearMessages: function(){
      $('#chats').empty();
    },
    addRoom: function(roomName){
      var self = this;
      var $li = $('<li class="animate flyInLeft fsm-item">');
      var $room = $('<a >');
      $room.text(roomName);
      $li.append($room);

      $room.on('click', function(){
        $(".sidemenu").toggleMenu();
        $('#room-header').text(roomName);
        self.roomname = roomName;
        $('.chat').each(function(){
          if ($(this).data("roomname") !== roomName) {
            $(this).hide();
          } else {
            $(this).show();
          }
        });
      });
      $('#room-header').text(roomName);
      $('#roomSelect').append($li);
    },
    clearRooms: function() {
      $('#roomSelect').empty();
    },
    handleSubmit: function(event){
      event.preventDefault();
      var message = {};
      message.username = this.username;
      message.text = $('#message').val();
      $('#message').val('');
      message.roomname = this.roomname;
      this.send(message);
    },
    addFriend: function(username){
      this.friends[username] = true;
    }
  };

$(document).ready(function(){

  app.init();

  $('#send .submit').on('click', app.handleSubmit.bind(app));

  // setTimeout( function(){
  // }, 3000);

  $('#message').keypress(function(event){
    if (event.which === 13) {
      app.handleSubmit(event);
    }
  });

  $('.username').click(function(){
    console.log("clicked");
    var username = $(this).text();

    app.addFriend(username);
    $('.message').each(function(){
      if($(this).closest('.username').text() === username){
        $(this).addClass('friend');
      }
    });
  });
  $('.sidemenu').fly_sidemenu({
    btnContent: "Rooms",
    position: 'left',
    customSelector: 'li',
    hideButton: false
  });

  $('#submit-room').on('click', function(){
    console.log('Hello');
    app.addRoom($('#new-room').val());
    $('#new-room').val('');
    $('.sidemenu').toggleMenu();
  });

  $('#new-room').keypress(function(event){
    if (event.which === 13) {
      app.addRoom($('#new-room').val());
      $('#new-room').val('');
      $('.sidemenu').toggleMenu();
    }
  })

});
