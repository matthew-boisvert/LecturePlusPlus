const Automerge = require('automerge');


var submitButtonElement = document.getElementById('submit');
var messageInputElement = document.getElementById('message');
var messageFormElement = document.getElementById('message-form');
var messageListElement = document.getElementById('messages');


var initialized = false; // this boolean flag is used so we don't trigger the intialize function twice.

var hashID = null; role = 'prof';

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

    betterLog('ID: ' + peer.id);
    if (hashID) initializeConnection(hashID);
    initializeQR(peer.id)
});

peer.on('disconnected', function () {
    status.innerHTML = "Connection lost. Try refreshing the page.";
    //betterLog('Connection lost. Please reconnect');
    // Workaround for peer.reconnect deleting previous id
    peer.id = lastPeerId;
    peer._lastServerId = lastPeerId;
    peer.reconnect();
});
peer.on('close', function () {
    conn = null;
    status.innerHTML = "Connection destroyed. Please refresh the page";
    betterLog('Connection destroyed');
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
    // betterLog("connection init", conn)
    // on open will be launch when you successfully connect to PeerServer
    conn.on('open', function () {
        // betterLog("sending hi", conn.id)
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
    // console.log(conn);
    conn.on('data', function (data) {
        // Will print 'hi!'
        // betterLog(data);
        displayMessage(Math.random(), 0, "banane", data); /////(id, timestamp, name, text)
        console.log("received message ", data);
    });
}

function sendMsg(msg) {
    console.log("connections: ",connections);
    for(var i=0; i<connections.length; i++) {
        const conn = connections[i];
        console.log("call sendmsg ", conn);
        displayMessage(Math.random(), 0, "une banane", msg); //(id, timestamp, name, text)
        if (conn != null) {
            console.log("conn: ",conn);
            conn.send(msg);
            console.log("Just sent message ", msg);
        }
    }
}

function initializeQR(peerId) {
    betterLog("Peer ID: " + peerId);
    const longLink = "https://matthew-boisvert.github.io/CruzHacks/public/index.html#" + peerId;
    // const longLink = "file:///Users/ryananderson/Desktop/cruz_hax/CruzHacks/public/index.html#" + peerId;

    new QRCode(document.getElementById("qr_container"),
        longLink);
    //https://people.ucsc.edu/~rykaande/

    shortenLink(longLink, function (shortlink) {
        if (shortlink) $('#shortlink_container').append(shortlink.replace("https://", "") + "</br>");
        else $('#shortlink_container').append(longLink.replace("https://", "") + "</br>");
    });
}

function betterLog(text1, text2) {
    console.log(text1, text2)
    $('#console_msgs').append(text1).append(", ").append(text2).append(document.createElement("br"));
};

function shortenLink(longLink, callbackFunc) {
    // Using is.gd and JSONP
    $.ajax({
        url: "https://is.gd/create.php",

        // The name of the callback parameter, as specified by the is.gd service
        jsonp: "callback",

        // Tell jQuery we're expecting JSONP
        dataType: "jsonp",

        // Tell is.gd what we want and that we want JSON
        data: {
            url: longLink,
            format: "json"
        },

        timeout: 3000, // sets timeout to 3 seconds

        // Work with the response
        success: function (response) {
            //console.log(response.shorturl); // server response
            callbackFunc(response.shorturl);
        },
        error: function (err) {
            console.warn('url shortener error', err)
            callbackFunc(null)
        }
    });
}

var possibleEmojis = [
    '🐀', '🐁', '🐭', '🐹', '🐂', '🐃', '🐄', '🐮', '🐅', '🐆', '🐯', '🐇', '🐐', '🐑', '🐏', '🐴',
    '🐎', '🐱', '🐈', '🐰', '🐓', '🐔', '🐤', '🐣', '🐥', '🐦', '🐧', '🐘', '🐩', '🐕', '🐷', '🐖',
    '🐗', '🐫', '🐪', '🐶', '🐺', '🐻', '🐨', '🐼', '🐵', '🙈', '🙉', '🙊', '🐒', '🐉', '🐲', '🐊',
    '🐍', '🐢', '🐸', '🐋', '🐳', '🐬', '🐙', '🐟', '🐠', '🐡', '🐚', '🐌', '🐛', '🐜', '🐝', '🐞',
];
function randomEmoji() {

    const randomIndex = Math.floor(Math.random() * possibleEmojis.length);
    return possibleEmojis[randomIndex];
}
const emoji = randomEmoji();


// Triggered when the send new message form is submitted.
function onMessageFormSubmit(e) {
    e.preventDefault();
    // Check that the user entered a message
    if (messageInputElement.value) {
        //saveMessage(messageInputElement.value).then(function() {
        sendMsg(messageInputElement.value); // Message Sendin' ya
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