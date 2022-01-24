$(function () {
    "use strict";

    // for better performance - to avoid searching in DOM
    var content = $('#content');
    var input = $('#input');
    var status = $('#status');



    // my color assigned by the server
    var myColor = false;
    // my name sent to the server
    var myName = false;

    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        showAlert('error', 'Twoja przeglądarka nie wspiera WebSocket ');
        input.hide();
        $('span').hide();
        return;
    }

    // open connection
    var adr = location.host.replace('/chat/1111/', '')
    var connection = new WebSocket('wss://' + adr);

    connection.onopen = function () {
        // first we want users to enter their names
        var cookie = getCookie('acount')
        if(cookie !== 'error'){
          connection.send(cookie);
          myName = JSON.parse(cookie).name;
        }
        else{
          var data = JSON.stringify({'room': room.id, 'name': "test", 'color': "test"})
          connection.send(data);
          setCookie('acount', data, 1)
        }
    };

    connection.onerror = function (error) {
        // just in there were some problems with conenction...
        content.html($('<p>', { text: 'Coś nie tak z twoim połączeniem lub serwerem.' } ));
    };

    // most important part - incoming messages
    connection.onmessage = function (message) {
        // try to parse JSON message. Because we know that the server always returns
        // JSON this should work without any problem but we should make sure that
        // the massage is not chunked or otherwise damaged.
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }
        console.log("response", json);
    };

    /**
     * Send mesage when user presses Enter key
     */
    
    let button = document.querySelector(".hero")
    let tempinput = document.querySelector("#tempslider")
    button.addEventListener('click', ()=>{
      if($("#tempslider").data("roundSlider").getValue() != currentTemp){
        console.log($("#tempslider").data("roundSlider").getValue());
        connection.send($("#tempslider").data("roundSlider").getValue())
      }
    })
    let button2 = document.querySelector(".hero.one")
    button2.addEventListener('click', ()=>{
      document.querySelector('div.tempform').style.display = "none";
    })
    let tab1 = document.querySelector("div.tab")
    tab1.addEventListener('click', ()=>{
      document.querySelector('div.tempform').style.display = "block";
    })
    input.keydown(function(e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) {
                return;
            }
            // send the message as an ordinary text
            var data = msg;
            connection.send(data);
            $(this).val('');
            // disable the input field to make the user wait until server
            // sends back response
            input.attr('disabled', 'disabled');
        }
    });

    /**
     * This method is optional. If the server wasn't able to respond to the
     * in 3 seconds then show some error message to notify the user that
     * something is wrong.
     */
    setInterval(function() {
        if (connection.readyState !== 1) {
            status.text('Wystąpił błąd');
            showAlert('error', 'Brak możliwości połącznia z serwerem.');
            input.attr('disabled', 'disabled');
        }
    }, 3000);

    /*
     * Add message to the chat window
     */
    function addMessage(author, message, color, dt) {
        content.append('<p><span style="background:' + color + '"; '+(myName == author ? 'class="msg my"': "class=msg") +'>' + author + ': ' + message + '<span class="onhover">'+ (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
             + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())+'</span></span></p>');
        input.focus();
        updateScroll();
    }

});
