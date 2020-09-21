/*******************************************************************************
 


 *******************************************************************************/

// Create a client instance
var client = null;
var MQTTState = false;
var MCU_state = 0;
var Initial_State = false;
var Debug_Console = false;

//TCP socket client
var NodeMCU_ip = "192.168.43.15";
var LoopBack_IP = "127.0.0.1";
var NodeMCU_port = 55555;
var SocketID = null;
var TCPState = false;



/////When document loaded completely it executes
$(document).ready(function() {

  $('#Connection_Properties').hide();
  $('#Control_View').hide();
  $('#ONLINEStatus').html("Not Connected");
  $('#OFFLINEStatus').html("Not Connected");

  /*
  $("#ONLINE_Click").click(function(){
    if(!MQTTState){
      connect();
    }
  }

  $("#OFFLINE_Click").click(function(){
    if(!TCPState){
     TCPConnect();
    }
  }
*/

////////// Data which is stored in the local we are retrieving        ////////////////
  var storage = window.localStorage;

  document.getElementById('hostInput').value=storage.getItem('hostInput');
  document.getElementById('portInput').value=storage.getItem('portInput');
  document.getElementById('clientIdInput').value=storage.getItem('clientIdInput');
  document.getElementById('userInput').value=storage.getItem('userInput');
  document.getElementById('passInput').value=storage.getItem('passInput');
  document.getElementById('keepAliveInput').value=storage.getItem('keepAliveInput');
  document.getElementById('timeoutInput').value=storage.getItem('timeoutInput');
//**************     Checck box values */



if(storage.getItem('tlsInput').localeCompare("true")  == 0){
    $("#tlsInput").prop('checked', true);
  }
  if(storage.getItem('tlsInput').localeCompare("false")  == 0){
    $("#tlsInput").removeAttr('checked');
  }
  
  if(storage.getItem('cleanSessionInput').localeCompare("true")  == 0){
    $("#cleanSessionInput").prop('checked', true);
  }
  if(storage.getItem('cleanSessionInput').localeCompare("false")  == 0){
    $("#cleanSessionInput").removeAttr('checked');
  }
  if(storage.getItem('automaticReconnectInput').localeCompare("true")  == 0){
    $("#automaticReconnectInput").prop('checked', true);
  }
  if(storage.getItem('automaticReconnectInput').localeCompare("false")  == 0){
    $("#automaticReconnectInput").removeAttr('checked');
  }

  document.getElementById('lwtInput').value=storage.getItem('lwtInput');
  document.getElementById('lwQosInput').value=storage.getItem('lwQosInput');
  document.getElementById('lwMInput').value=storage.getItem('lwMInput');
})


$("#Refresh_button").click(function(){
 if((MQTTState == false) && (TCPState == false))
  {
   if(Debug_Console){
    alert("CONNECT first and then try");
   }
   return ;
  }
  MCU_state = MCU_state + 1;
  if(MCU_state > 5){
    alert("Controlling Device is not Connected. \nPlease Connect it and try again!");
  }
  if(TCPState == true){
//    alert("In refresh");
    TCPSenddata("ping?");
    TCPSenddata("Status_Please?");
  }
  if(MQTTState == true){
    publish_Own("ping?");
    publish_Own("Status_Please?");
  }

});

/////Send mesage when click on switch for LED
$("#switchled").on('change', function() {
  if ($(this).is(':checked')) {
      $(this).attr('value', 'true');
      //alert($(this).val());
      TCPSenddata("LIGHT_ON:HOME");
      publish_Own("LIGHT_ON:HOME");
  }
  else {
     $(this).attr('value', 'false');
 //    alert($(this).val());
      TCPSenddata("LIGHT_OFF:HOME");
      publish_Own("LIGHT_OFF:HOME");
    }
});

/////Send message when click on switch for TV
$("#switchtv").on('change', function() {
  if ($(this).is(':checked')) {
      $(this).attr('value', 'true');
      //alert($(this).val());
      TCPSenddata("TV_ON:HOME");
      publish_Own("TV_ON:HOME");
  }
  else {
     $(this).attr('value', 'false');
 //    alert($(this).val());
      TCPSenddata("TV_OFF:HOME");
      publish_Own("TV_OFF:HOME");
    }
});

/////Send mesage when click on switch for Bed Lamp
$("#switchnightled").on('change', function() {
  if ($(this).is(':checked')) {
      $(this).attr('value', 'true');
      //alert($(this).val());
      TCPSenddata("NIGHTLIGHT_ON:HOME");
      publish_Own("NIGHTLIGHT_ON:HOME");
    }
  else {
     $(this).attr('value', 'false');
 //    alert($(this).val());
     TCPSenddata("NIGHTLIGHT_OFF:HOME");
      publish_Own("NIGHTLIGHT_OFF:HOME");
     }
});

/////Send mesage when click on switch for FAN
$("#switchfan").on('change', function() {
  if ($(this).is(':checked')) {
      $(this).attr('value', 'true');
      //alert($(this).val());
      TCPSenddata("FAN_ON:HOME");
      publish_Own("FAN_ON:HOME");
  }
  else {
     $(this).attr('value', 'false');
 //    alert($(this).val());
     TCPSenddata("FAN_OFF:HOME");
     publish_Own("FAN_OFF:HOME");
    }
});

function CONNECT(){
  if(TCPState){
    TCPDisconnect();
    $('#Control_View').hide();
    if(!MQTTState){
      return;
    }
  }
  if(MQTTState){
    disconnect();
    $('#Control_View').hide();
    return;
  }
  else{
    connect();
    TCPConnect();
  }
}

/////////////////////////////////////////////////////////////
function configuration_mqtt(){
  if(Debug_Console){
    alert("Called Configured");
  }
  var x = document.getElementById("Connection_Properties");
  var storage = window.localStorage;

  if (x.style.display === "none") {
    $('#ConnectView').hide();
    $('#Setting_button').html(" Save");
    $('#Control_View').hide();
    x.style.display = "block";
  } else {
    x.style.display = "none";
    $('#ConnectView').show();
    if(TCPState || MQTTState){
    $('#Control_View').show();}
    $('#Setting_button').html(" Settings");
    storage.setItem('hostInput', document.getElementById('hostInput').value);
    storage.setItem('portInput', document.getElementById('portInput').value);
    storage.setItem('clientIdInput', document.getElementById('clientIdInput').value);
    storage.setItem('userInput', document.getElementById('userInput').value);
    storage.setItem('passInput', document.getElementById('passInput').value);
    storage.setItem('keepAliveInput', document.getElementById('keepAliveInput').value);
    storage.setItem('timeoutInput', document.getElementById('timeoutInput').value);

    if($('#tlsInput').is(":checked") == true){
      storage.setItem('tlsInput', true);
    }
    else{
      storage.setItem('tlsInput', false);
    }
    if($('#cleanSessionInput').is(":checked") == true){
      storage.setItem('cleanSessionInput', true);
    }
    else{
      storage.setItem('cleanSessionInput', false);
    }
    if($('#automaticReconnectInput').is(":checked") == true){
      storage.setItem('automaticReconnectInput', true);
    }
    else{
      storage.setItem('automaticReconnectInput', false);
    }

    storage.setItem('lwtInput', document.getElementById('lwtInput').value);
    storage.setItem('lwQosInput', document.getElementById('lwQosInput').value);
    storage.setItem('lwMInput', document.getElementById('lwMInput').value);
  }
}
//////////////////////////////////////////////////////////////
// called when the client connects
function onConnect(context) {
  // Once a connection has been made, make a subscription and send a message.
  MQTTState = true;
  if(Debug_Console){
  alert("Successfully Connected to Broker");}
  $('#clientConnectButton').html("Disconnect");
  document.getElementById("clientConnectButton").className = "buttonc button2";
  $('#ONLINEStatus').html("Connected");

  subscribe();
  publish_Own("ping?");
  publish_Own("Status_Please?");
  MCU_state = 0;
//  $('#Control_View').show();

}

//////////////////////////////////////////////////////////////
function onConnected(reconnect, uri) {
  // Once a connection has been made, make a subscription and send a message.
  MQTTState = true;

}
/////////////////////////////////////////////////////////////
function publish_Own(mess) {
  if(MQTTState == false){
    return;
  }
  var topic = "sri8352/feeds/srikanth.home";
  var qos = "0";
  var message = mess;
  var retain = false;
//  logMessage("INFO", "Publishing Message: [Topic: ", topic, ", Payload: ", message, ", QoS: ", qos, ", Retain: ", retain, "]");
  message = new Paho.Message(message);
  message.destinationName = topic;
  message.qos = Number(qos);
  message.retained = retain;
  client.send(message);
}

//////////////////////////////////////////////////////////////
function onFail(context) {
  MQTTState = false;
  $('#ONLINEStatus').html("Not Connected");
  $('#Control_View').hide();
  if(Debug_Console){
    alert("Failed to connect,Check Connection SETTINGS and Connect again!.\n ERROR: ".concat(context.errorMessage));}
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  MQTTState = false;
  if(Debug_Console){
    alert("Connection Lost with error: ".concat(responseObject.errorMessage));}
  $('#clientConnectButton').html("Connect");
  document.getElementById("clientConnectButton").className = "buttonc button1";
  $('#ONLINEStatus').html("Not Connected");
  $('#Control_View').hide();
}


function ApplicationWork(WorkData){
  if(WorkData.match("OK") ){
    MCU_state = 0;
  }

 //Refresh the pins status 
  if(WorkData.match("Status_Back")){
    if(WorkData.match(":LIGHT_OFF:")){
      //Light to OFF toggle
      if($("#switchled").is(':checked') == true) {
        $("#switchled").attr('value', 'false'); //set value false
        $("#switchled").prop('checked', false); // Unchecks it
      }
    }
    if(WorkData.match(":LIGHT_ON:")){
      //Light to ON toggle
      if($("#switchled").is(':checked') == false) {
        $("#switchled").attr('value', 'true'); //set value true
        $("#switchled").prop('checked', true); // Checks it
      }
    }
    if(WorkData.match(":TV_OFF:")){
      //TV to OFF toggle
      if($("#switchtv").is(':checked') == true) {
        $("#switchtv").attr('value', 'false'); //set value false
        $("#switchtv").prop('checked', false); // Unchecks it
      }
    }
    if(WorkData.match(":TV_ON:")){
      //TV to ON toggle
      if($("#switchtv").is(':checked') == false) {
        $("#switchtv").attr('value', 'true'); //set value true
        $("#switchtv").prop('checked', true); // Checks it
      }
    }
    if(WorkData.match(":FAN_OFF:")){
      //FAN to OFF toggle
      if($("#switchfan").is(':checked') == true) {
            $("#switchfan").attr('value', 'false'); //set value false
            $("#switchfan").prop('checked', false); // Unchecks it
        }
    }
    if(WorkData.match(":FAN_ON:")){
      //FAN to ON toggle
      if($("#switchfan").is(':checked') == false) {
        $("#switchfan").attr('value', 'true'); //set value true
        $("#switchfan").prop('checked', true); // Checks it
      }
    }
    if(WorkData.match(":NIGHTLIGHT_OFF:")){
      //Night Light to OFF toggle
      if($("#switchnightled").is(':checked') == true) {
        $("#switchnightled").attr('value', 'false'); //set value false
        $("#switchnightled").prop('checked', false); // Unchecks it
      }
    }   
    if(WorkData.match(":NIGHTLIGHT_ON:")){
      //Night Light to ON toggle
      if($("#switchnightled").is(':checked') == false) {
        $("#switchnightled").attr('value', 'true'); //set value true
        $("#switchnightled").prop('checked', true); // Checks it
      }
    }

    ///Buttons to show
    $('#Control_View').show();
  }//Refresh pins if end
}

// called when a message arrives
function onMessageArrived(message) {
 // var messageTime = new Date().toISOString();
 /////////   If device is connected it sends the request to send pins status    ////////////// 
 ApplicationWork(message.payloadString);
/*    message.destinationName;
    message.destinationName;
    var res = message.payloadString.match(/ReadBack/)
    message.payloadString.search("ReadMe_Status")
    messageTime;
    message.qos;
*/
}// Function end

function connect() {
  var hostname = document.getElementById("hostInput").value;
  var port = document.getElementById("portInput").value;
  var clientId = "Sri_Utility-" + makeid();

  var path = 0 //document.getElementById("pathInput").value;
  var user = document.getElementById("userInput").value;
  var pass = document.getElementById("passInput").value;
  var keepAlive = Number(document.getElementById("keepAliveInput").value);
  var timeout = Number(document.getElementById("timeoutInput").value);

  var tls = document.getElementById("tlsInput").checked;
//  var tls = $('#tlsInput').val();
  var automaticReconnect = document.getElementById("automaticReconnectInput").checked;
  var cleanSession = document.getElementById("cleanSessionInput").checked;
  var lastWillTopic = document.getElementById("lwtInput").value;
  var lastWillQos = Number(document.getElementById("lwQosInput").value);
//  var lastWillRetain = document.getElementById("lwRetainInput").checked;
  var lastWillMessageVal = document.getElementById("lwMInput").value;

  if (path.length > 0) {
    client = new Paho.Client(hostname, Number(port), path, clientId);
  } else {
    client = new Paho.Client(hostname, Number(port), clientId);
  }
  //logMessage("INFO", "Connecting to Server: [Host: ", hostname, ", Port: ", port, ", Path: ", client.path, ", ID: ", clientId, "]");
  // set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
  client.onConnected = onConnected;

  var options = {
    invocationContext: { host: hostname, port: port, path: client.path, clientId: clientId },
    timeout: timeout,
    keepAliveInterval: keepAlive,
    cleanSession: cleanSession,
    useSSL: tls,
    reconnect: automaticReconnect,
    onSuccess: onConnect,
    onFailure: onFail
  };

  if (user.length > 0) {
    options.userName = user;
  }

  if (pass.length > 0) {
    options.password = pass;
  }

  if (lastWillTopic.length > 0) {
    var lastWillMessage = new Paho.Message(lastWillMessageVal);
    lastWillMessage.destinationName = lastWillTopic;
    lastWillMessage.qos = lastWillQos;
//    lastWillMessage.retained = lastWillRetain;
    options.willMessage = lastWillMessage;
  }
  if(Debug_Console){
    alert("Called connect"); }
  // connect the client
  client.connect(options);
  $('#ONLINEStatus').html("Connecting...");
}

function disconnect() {
  if(Debug_Console){
    alert("Disconnect");}
  client.disconnect();
  $('#Control_View').hide();
  $('#clientConnectButton').html("Connect");
  document.getElementById("clientConnectButton").className = "buttonc button1";
  $('#ONLINEStatus').html("Not Connected");
  MQTTState = false;
}

function publish() {
  var topic = document.getElementById("publishTopicInput").value;
  var qos = document.getElementById("publishQosInput").value;
  var message = document.getElementById("publishMessageInput").value;
  var retain = document.getElementById("publishRetainInput").checked;
  message = new Paho.Message(message);
  message.destinationName = topic;
  message.qos = Number(qos);
  message.retained = retain;
  client.send(message);
}

function subscribe() {
//  var topic = document.getElementById("subscribeTopicInput").value;
//  var qos = document.getElementById("subscribeQosInput").value;
//  logMessage("INFO", "Subscribing to: [Topic: ", topic, ", QoS: ", qos, "]");
  var topic = "sri8352/feeds/srikanth.readback";
  var qos = "0";
  client.subscribe(topic, { qos: Number(qos) });
}

function unsubscribe() {
  var topic = 0;
  client.unsubscribe(topic, {
    onSuccess: unsubscribeSuccess,
    onFailure: unsubscribeFailure,
    invocationContext: { topic: topic }
  });
}

function unsubscribeSuccess(context) {
//  logMessage("INFO", "Unsubscribed. [Topic: ", context.invocationContext.topic, "]");
}

function unsubscribeFailure(context) {
//  logMessage("ERROR", "Failed to unsubscribe. [Topic: ", context.invocationContext.topic, ", Error: ", context.errorMessage, "]");
if(Debug_Console){
  alert("Unsubscribe failure: ")}
}

////////////////// ON Connect Callback //////////////////////
function TCPconnectedCallback(result) {
  if(Debug_Console){
//    alert("In Connected function");
  }

      if (result == 0) {
        if(Debug_Console){
          alert('Socket Connected to ' + NodeMCU_ip);}                        
           console.log('Connected to ' + NodeMCU_ip);
           $('#clientConnectButton').html("Disconnect");
           document.getElementById("clientConnectButton").className = "buttonc button2";
           $('#OFFLINEStatus').html("Connected");
           $('#Control_View').show();
           TCPState =  true;   
           MCU_state  = 0;  
           //Generating click event
           $( "#Refresh_button" ).trigger( "click" );
      }
      else {
          var errorMessage = 'Failed to connect to ' + NodeMCU_ip;
          if(Debug_Console){
            alert('Failed to connect to local TCP server' + NodeMCU_ip);}
          console.log(errorMessage);
          $('#clientConnectButton').html("Connect");
          document.getElementById("clientConnectButton").className = "buttonc button1";
          $('#OFFLINEStatus').html("Not Connected");
          $('#Control_View').hide();
          TCPState  =   false;
  //        navigator.notification.alert(errorMessage, function() {})
      }
  }
  
 function TCPConnect(){
  NodeMCU_ip   = document.getElementById("IPInput").value;
  NodeMCU_port = Number(document.getElementById("PORTInput").value);
  if(Debug_Console){
    alert("In TCP Connect function");
  }
  chrome.sockets.tcp.create(function(createInfo) {
    SocketID = createInfo.socketId;
    chrome.sockets.tcp.setPaused(SocketID, false);
    if(Debug_Console){
      alert("Socket created");
    }
    chrome.sockets.tcp.onReceive.addListener(function(info){
      if(Debug_Console){
        alert("In data receive function");}
     if (info.data){
         ApplicationWork(ab2str(info.data));
         if(Debug_Console){
          alert("In data receive "+ab2str(info.data));}
     }
});
    chrome.sockets.tcp.connect(
        SocketID,
        NodeMCU_ip,
        NodeMCU_port,
        TCPconnectedCallback)
    })       
} 


///////////////////////////////////////////////////////////////////
function TCPSenddata(TCPMessage){
if(Debug_Console){
  alert("In sendata function");
}
      var arrayBuffer = rawStringToBuffer(TCPMessage);

      if(TCPState) {
        chrome.sockets.tcp.send (
          SocketID,
          arrayBuffer,
          function(sendInfo) {
            if(Debug_Console){
              alert("Senddata func inn");
            }
              if (sendInfo.resultCode < 0) {
                  var errorMessage = 'Failed to send data';
                  console.log(errorMessage);
                  alert(errorMessage);
              }
              else{
                if(Debug_Console){
                  alert("Data sent successfully : "+ sendInfo.bytesSent);
                }
              }
          }	
        )
      }
}


///////////////// Disconnect   /////////////////////
function TCPDisconnect() {
  if(Debug_Console){
    alert("IN Disconnect function");
  }
    chrome.sockets.tcp.disconnect(SocketID, function(){
      if(Debug_Console){
        alert("Disconnected success");
      }
      TCPState  =   false;
      $('#clientConnectButton').html("Connect");
      document.getElementById("clientConnectButton").className = "buttonc button1";
      $('#OFFLINEStatus').html("Not Connected");
      $('#Control_View').hide();

    })
    chrome.sockets.tcp.close(SocketID, function() {
          console.log('TCP Socket close finished.');
          TCPState  =   false;
          $('#clientConnectButton').html("Connect");
          document.getElementById("clientConnectButton").className = "buttonc button1";
          $('#OFFLINEStatus').html("Not Connected");
          $('#Control_View').hide();
          if(Debug_Console){
            alert("Socket Closed");
          }
    })
}
///////////////// On data receive data /////////////////
function TCPOnReceive(info){
  if(Debug_Console){
    alert("In data receive function");
  }
     if (info.data){
         ApplicationWork(bufferToString(info.data));
         if(Debug_Console){
           alert(bufferToString(info.data));
         }
     }
}

// Just in case someone sends html
function safeTagsRegex(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").
    replace(/>/g, "&gt;");
}

//Helper functions
function rawStringToBuffer( str ) {
  var idx, len = str.length, arr = new Array( len );
  for ( idx = 0 ; idx < len ; ++idx ) {
      arr[ idx ] = str.charCodeAt(idx) & 0xFF;
  }
  // You may create an ArrayBuffer from a standard array (of values) as follows:
  return new Uint8Array( arr ).buffer;
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

//////Function to make id as anonymous 
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

