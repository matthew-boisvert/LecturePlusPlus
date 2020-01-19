var merge = require('./modules/merge');
var utils = require('./modules/utils');

var submitButtonElement = document.getElementById('submit');
var messageInputElement = document.getElementById('message');
var messageFormElement = document.getElementById('message-form');
var messageListElement = document.getElementById('messages');

var hashID = null; role = 'prof';
const myEmojiNumber = utils.randomEmojiNumber();
const myEmoji = utils.getEmoji(myEmojiNumber);

// var conn;
var connections = [];

// Template for messages.
var MESSAGE_TEMPLATE =
    '<div class="message-container">' +
    '<div class="spacing"><div class="pic"></div></div>' +
    '<div class="message"></div>' +
    '<div class="name"></div>' +
    '</div>';

if (window.location.hash.length > 1) { // check if the url contains a hash
    hashID = window.location.hash.substr(1, window.location.hash.length - 1);
    role = 'student';
}

var lastPeerId = null;

// Create own peer object with connection to shared PeerJS server
peer = new Peer(null, {
    debug: 2
});

// This is to create your own peer object
peer.on('open', function (id) {
    console.log("open peer id ", id);
    // Workaround for peer.reconnect deleting previous id
    if (peer.id === null) {
        console.log('Received null id from peer open');
        peer.id = lastPeerId;
    } else {
        lastPeerId = peer.id;
    }

    // utils.betterLog('ID: ' + peer.id);
    if (hashID) initializeConnection(hashID);
    initializeQR(peer.id)
});

peer.on('disconnected', function () {
    status.innerHTML = "Connection lost. Try refreshing the page.";
    //utils.betterLog('Connection lost. Please reconnect');
    // Workaround for peer.reconnect deleting previous id
    peer.id = lastPeerId;
    peer._lastServerId = lastPeerId;
    peer.reconnect();
});
peer.on('close', function () {
    conn = null;
    status.innerHTML = "Connection destroyed. Please refresh the page";
    // utils.betterLog('Connection destroyed');
});
peer.on('error', function (err) {
    console.warn(err);
    alert('' + err);
});

// Gets triggered when someone tries to CONNECT with another
function initializeConnection(targetId) {
    console.log("initializeConnection", targetId);
    var conn = peer.connect(targetId);
    connections.push(conn);
    // utils.betterLog("connection init", conn)
    // on open will be launch when you successfully connect to PeerServer
    conn.on('open', function () {
        // utils.betterLog("sending hi", conn.id)
        // here you have conn.id
        // conn.send('REEEEEE!');
        startListening(conn);
    });
}

// Gets triggered when someone connects to you.
peer.on('connection', function (_conn) {
    conn = _conn;
    connections.push(conn);
    // console.log("peer on connection", conn);
    startListening(conn);
});

function startListening(conn) {
    console.log("beginning to listen")
    console.log(conn);
    conn.on('data', function (data) {
        // console.log();
        console.log("RECEIVED DATA: ", data);
        // Will print 'hi!'
        // utils.betterLog(data);
        dataObj = JSON.parse(data);
        console.log("OBJ FORM: ", dataObj);

        displayMessage(dataObj.msgId, dataObj.timestamp, utils.getEmoji(dataObj.senderEmoji), dataObj.message); /////(id, timestamp, name, text)
        // console.log("received message ", data);
        //msgId, timestamp, senderName, message
        //sendMsgAllExceptOne(data, conn);
        // RELAY THE MESSAGE TO THE NEIGHBORS
        for(var i=0; i<connections.length; i++) {
            if(connections[i] != conn) {
                connections[i].send(data);
            }
        }
    });
}

function sendMsgAll(msg) {
    console.log("connections: ", connections);
    displayMessage(Math.random(), 0, myEmoji, msg); //(id, timestamp, name, text)
    for (var i = 0; i < connections.length; i++) {
        sendMsg(msg, connections[i]);
    }
}

// function sendMsgAllExceptOne(msg, conn) {
//     console.log("connections: ", connections);
    // displayMessage(Math.random(), 0, myEmoji, msg); //(id, timestamp, name, text)
    // for (var i = 0; i < connections.length; i++) {
    //     if(conn != connections[i]) sendMsg(msg, connections[i]);
    // }
// }

function relayMessageObject(msgObj, conn) {
    // con is the conneciton object from which msgObj orignated.
        // displayMessage(Math.random(), 0, myEmoji, msg); //(id, timestamp, name, text)
    for (var i = 0; i < connections.length; i++) {
        if(conn != connections[i]) sendMsg(msg, connections[i]);
    }
}


function sendMsg(msg, conn) {
    console.log("call sendmsg ", conn);
    if (conn != null) {
        console.log("conn: ", conn);
        console.log("Just sent message ", msg);

        const toSend = {
            msgId: Math.random(),
            timestamp: 0,
            senderEmoji: myEmojiNumber,
            message: msg
        };

        var jsonSend = JSON.stringify(toSend);
        // jsonSend = jsonSend.replace(/"/g, '@');

        console.log("I want to send the message: ",jsonSend);
        conn.send(jsonSend); //TODO uncomment

    }
}

function initializeQR(peerId) {
    // utils.betterLog("Peer ID: " + peerId);
    const longLink = "https://matthew-boisvert.github.io/CruzHacks/public/index.html#" + peerId;
    // const longLink = "file:///Users/ryananderson/Desktop/cruz_hax/CruzHacks/public/index.html#" + peerId;

    new QRCode(document.getElementById("qr_container"),
        longLink);
    //https://people.ucsc.edu/~rykaande/

    utils.shortenLink(longLink, function (shortlink) {
        if (shortlink) $('#shortlink_container').append(shortlink.replace("https://", "") + "</br>");
        else $('#shortlink_container').append(longLink.replace("https://", "") + "</br>");
    });
}



// Triggered when the send new message form is submitted.
function onMessageFormSubmit(e) {
    e.preventDefault();
    // Check that the user entered a message
    if (messageInputElement.value) {
        //saveMessage(messageInputElement.value).then(function() {
        sendMsgAll(messageInputElement.value); // Message Sendin' ya
        // TODO send our message through P2P! And then execute the code below in a callback (idk how that will work)
        // Clear message text field and re-enable the SEND button.
        resetMaterialTextfield(messageInputElement);
        toggleButton();
        //});
    }
}

function toggleButton() {
    if (messageInputElement.value) {
        submitButtonElement.removeAttribute('disabled');
    } else {
        submitButtonElement.setAttribute('disabled', 'true');
    }
}

// Resets the given MaterialTextField.
function resetMaterialTextfield(element) {
    element.value = '';
    element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
}

function displayMessage(id, timestamp, name, text) {
    console.log("displaty message");
    var div = document.getElementById(id) || createAndInsertMessage(id, timestamp);

    div.querySelector('.name').textContent = name;
    var messageElement = div.querySelector('.message');

    if (text) { // If the message is text.
        messageElement.textContent = text;
        // Replace all line breaks by <br>.
        messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
    }
    // Show the card fading-in and scroll to view the new message.
    setTimeout(function () { div.classList.add('visible') }, 1);
    messageListElement.scrollTop = messageListElement.scrollHeight;
    messageInputElement.focus();
}

function createAndInsertMessage(id, timestamp) {
    const container = document.createElement('div');
    container.innerHTML = MESSAGE_TEMPLATE;
    const div = container.firstChild;
    div.setAttribute('id', id);

    // If timestamp is null, assume we've gotten a brand new message.
    // https://stackoverflow.com/a/47781432/4816918
    timestamp = timestamp ? timestamp.toMillis() : Date.now();
    div.setAttribute('timestamp', timestamp);

    // figure out where to insert new message
    const existingMessages = messageListElement.children;
    if (existingMessages.length === 0) {
        messageListElement.appendChild(div);
    } else {
        let messageListNode = existingMessages[0];

        while (messageListNode) {
            const messageListNodeTime = messageListNode.getAttribute('timestamp');

            if (!messageListNodeTime) {
                throw new Error(
                    `Child ${messageListNode.id} has no 'timestamp' attribute`
                );
            }

            if (messageListNodeTime > timestamp) {
                break;
            }

            messageListNode = messageListNode.nextSibling;
        }

        messageListElement.insertBefore(div, messageListNode);
    }

    return div;
}

messageFormElement.addEventListener('submit', onMessageFormSubmit);
messageInputElement.addEventListener('keyup', toggleButton);
messageInputElement.addEventListener('change', toggleButton);