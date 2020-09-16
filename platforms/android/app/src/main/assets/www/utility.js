/*******************************************************************************
 


 *******************************************************************************/

// Create a client instance
var client = null;
var connected = false;
var MCU_state = 0;
/////When document loaded completely it executes
$(document).ready(function() {

  $('#Connection_Properties').hide();
  $('#Before_connect_control').hide();

  var storage = window.localStorage;
  document.getElementById('hostInput').value=storage.getItem('hostInput');
  document.getElementById('portInput').value=storage.getItem('portInput');
  document.getElementById('clientIdInput').value=storage.getItem('clientIdInput');
  document.getElementById('userInput').value=storage.getItem('userInput');
  document.getElementById('passInput').value=storage.getItem('passInput');
  document.getElementById('keepAliveInput').value=storage.getItem('keepAliveInput');
  document.getElementById('timeoutInput').value=storage.getItem('timeoutInput');


 // str1.localeCompare("true")

  if(storage.getItem('tlsInput').localeCompare("true")  == 0){
    $( "#tlsInput").prop('checked', true);
  }
  if(storage.getItem('tlsInput').localeCompare("false")  == 0){
    $('#tlsInput').removeAttr('checked');
  }
  if(storage.getItem('cleanSessionInput').localeCompare("true")  == 0){
    $( "#cleanSessionInput").prop('checked', true);
  }
  if(storage.getItem('cleanSessionInput').localeCompare("false")  == 0){
    $('#cleanSessionInput').removeAttr('checked');
  }
  if(storage.getItem('automaticReconnectInput').localeCompare("true")  == 0){
    $( "#automaticReconnectInput").prop('checked', true);
  }
  if(storage.getItem('automaticReconnectInput').localeCompare("false")  == 0){
    $('#automaticReconnectInput').removeAttr('checked');
  }

  document.getElementById('lwtInput').value=storage.getItem('lwtInput');
  document.getElementById('lwQosInput').value=storage.getItem('lwQosInput');
  document.getElementById('lwMInput').value=storage.getItem('lwMInput');
})


$("#Refresh_button").click(function(){
//  var storage = window.localStorage;
  typeof(operand)
//  str1.localeCompare(str2)

//  $('#test1').html(typeof(storage.getItem('tlsInput'))))
//  $('#test2').html(typeof(storage.getItem('cleanSessionInput')))
 // $('#test3').html(typeof(storage.getItem('automaticReconnectInput')))

 if(connected == false)
  {
   alert("CONNECT first and then try");
   return ;
  }
  MCU_state = MCU_state + 1;
  if(MCU_state > 2){
    alert("Controlling Device is not Connected to the Internet. \nPlease Connect it and try again!");
//    $('#Before_connect_control *').hide();
  }
  publish_Own("?Are you connected?");
  publish_Own("?Send me the status of all pins?");
//  alert("In refresh function");
  //$('#Before_connect_control *').show();
 
});

/////Send mesage when click on switch for LED
$("#switchled").on('change', function() {
  if ($(this).is(':checked')) {
      $(this).attr('value', 'true');
      //alert($(this).val());
      publish_Own("LIGHT_ON:HOME");
  }
  else {
     $(this).attr('value', 'false');
 //    alert($(this).val());
     publish_Own("LIGHT_OFF:HOME");
    }
});

/////Send message when click on switch for TV
$("#switchtv").on('change', function() {
  if ($(this).is(':checked')) {
      $(this).attr('value', 'true');
      //alert($(this).val());
      publish_Own("TV_ON:HOME");
  }
  else {
     $(this).attr('value', 'false');
 //    alert($(this).val());
     publish_Own("TV_OFF:HOME");
    }
});

/////Send mesage when click on switch for Bed Lamp
$("#switchnightled").on('change', function() {
  if ($(this).is(':checked')) {
      $(this).attr('value', 'true');
      //alert($(this).val());
      publish_Own("NIGHTLIGHT_ON:HOME");
  }
  else {
     $(this).attr('value', 'false');
 //    alert($(this).val());
     publish_Own("NIGHTLIGHT_OFF:HOME");
    }
});

/////Send mesage when click on switch for FAN
$("#switchfan").on('change', function() {
  if ($(this).is(':checked')) {
      $(this).attr('value', 'true');
      //alert($(this).val());
      publish_Own("FAN_ON:HOME");
  }
  else {
     $(this).attr('value', 'false');
 //    alert($(this).val());
     publish_Own("FAN_OFF:HOME");
    }
});

function CONNECT(){
  if(connected){
    disconnect();
  }
  else{
    connect();
  }
}

/////////////////////////////////////////////////////////////
function configuration_mqtt(){
//  alert("Called Configured");
  var x = document.getElementById("Connection_Properties");
  var storage = window.localStorage;

  if (x.style.display === "none") {
    $('#ConnectView').hide();
    $('#Publish_Message').hide();
    $('#Setting_button').html(" Save");

    x.style.display = "block";
  } else {
    x.style.display = "none";
    $('#ConnectView').show();
    $('#Publish_Message').show();
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
  if(connected)
  disconnect();
//  alert("Config");
}
//////////////////////////////////////////////////////////////
// called when the client connects
function onConnect(context) {
  // Once a connection has been made, make a subscription and send a message.
  connected = true;
//  alert("Successfully Connected to Broker");
  $('#clientConnectButton').html("Disconnect")
  $('#Status_Property').html(" Connected")
//Place the code to read the data from the MCU
//Sending the query to enquire about the device connection if connected then only the Buttons will appear

  document.getElementById("clientConnectButton").className = "buttonc button2";
  subscribe();
  publish_Own("?Are you connected?");
  publish_Own("?Send me the status of all pins?");


}

//////////////////////////////////////////////////////////////
function onConnected(reconnect, uri) {
  // Once a connection has been made, make a subscription and send a message.
  connected = true;
 // $('#clientConnectButton').hide();

}
/////////////////////////////////////////////////////////////
function publish_Own(mess) {
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
  connected = false;
  alert("Failed to connect, Please connect again");
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
/*  if (responseObject.errorCode !== 0) {
    logMessage("INFO", "Connection Lost. [Error Message: ", responseObject.errorMessage, "]");
  }*/
  connected = false;
  document.getElementById("clientConnectButton").className = "buttonc button1";
  $('#Status_Property').html(" Not Connected");

}

// called when a message arrives
function onMessageArrived(message) {
 // logMessage("INFO", "Message Recieved: [Topic: ", message.destinationName, ", Payload: ", message.payloadString, ", QoS: ", message.qos, ", Retained: ", message.retained, ", Duplicate: ", message.duplicate, "]");
 // var messageTime = new Date().toISOString();
 /////////If device is connected it sends the request to send pins status////////////// 
  if(message.payloadString.match("Yes, Iam") ){
    MCU_state = 0;
//    publish_Own("?Send me the status of all pins?");
  }

 //Refresh the pins status 
  if(message.payloadString.match(":Node pins status:")){
    if(message.payloadString.match(":LIGHT_OFF:")){
      //Light to OFF toggle
      if($("#switchled").is(':checked') == true) {
        $("#switchled").attr('value', 'false'); //set value false
        $("#switchled").prop('checked', false); // Unchecks it
      }
    }
    if(message.payloadString.match(":LIGHT_ON:")){
      //Light to ON toggle
      if($("#switchled").is(':checked') == false) {
        $("#switchled").attr('value', 'true'); //set value true
        $("#switchled").prop('checked', true); // Checks it
      }
    }
    if(message.payloadString.match(":TV_OFF:")){
      //TV to OFF toggle
      if($("#switchtv").is(':checked') == true) {
        $("#switchtv").attr('value', 'false'); //set value false
        $("#switchtv").prop('checked', false); // Unchecks it
      }
    }
    if(message.payloadString.match(":TV_ON:")){
      //TV to ON toggle
      if($("#switchtv").is(':checked') == false) {
        $("#switchtv").attr('value', 'true'); //set value true
        $("#switchtv").prop('checked', true); // Checks it
      }
    }
    if(message.payloadString.match(":FAN_OFF:")){
      //FAN to OFF toggle
      if($("#switchfan").is(':checked') == true) {
            $("#switchfan").attr('value', 'false'); //set value false
            $("#switchfan").prop('checked', false); // Unchecks it
        }
    }
    if(message.payloadString.match(":FAN_ON :")){
      //FAN to ON toggle
      if($("#switchfan").is(':checked') == false) {
        $("#switchfan").attr('value', 'true'); //set value true
        $("#switchfan").prop('checked', true); // Checks it
      }
    }
    if(message.payloadString.match(":NIGHTLIGHT_OFF:")){
      //Night Light to OFF toggle
      if($("#switchnightled").is(':checked') == true) {
        $("#switchnightled").attr('value', 'false'); //set value false
        $("#switchnightled").prop('checked', false); // Unchecks it
      }
    }   
    if(message.payloadString.match(":NIGHTLIGHT_ON:")){
      //Night Light to ON toggle
      if($("#switchnightled").is(':checked') == false) {
        $("#switchnightled").attr('value', 'true'); //set value true
        $("#switchnightled").prop('checked', true); // Checks it
      }
    }

    ///Buttons to show
    $('#Before_connect_control').show();
//    $('#Before_connect_control *').show();


  }//Refresh pins if end
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
  var automaticReconnect = document.getElementById("automaticReconnectInput").checked;

//  var cleanSession = document.getElementById("cleanSessionInput").checked;
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
  //  cleanSession: cleanSession,
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
  //  lastWillMessage.retained = lastWillRetain;
    options.willMessage = lastWillMessage;
  }
 
  // connect the client
  client.connect(options);
//  alert("Called connect");
}

function disconnect() {
//  alert("Disconnect");
  client.disconnect();
  $('#Before_connect_control *').hide();
  $('#clientConnectButton').html("Connect");
  $('#Status_Property').html(" Not Connected");
  document.getElementById("clientConnectButton").className = "buttonc button1";

  connected = false;
}


function publish() {
  var topic = document.getElementById("publishTopicInput").value;
  var qos = document.getElementById("publishQosInput").value;
  var message = document.getElementById("publishMessageInput").value;
  var retain = document.getElementById("publishRetainInput").checked;
//  logMessage("INFO", "Publishing Message: [Topic: ", topic, ", Payload: ", message, ", QoS: ", qos, ", Retain: ", retain, "]");
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
  var topic = document.getElementById("subscribeTopicInput").value;
  logMessage("INFO", "Unsubscribing: [Topic: ", topic, "]");
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
alert("Unsubscribe failure: ")
}


// Just in case someone sends html
function safeTagsRegex(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").
    replace(/>/g, "&gt;");
}

//////Function to make id as anonymous 
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

