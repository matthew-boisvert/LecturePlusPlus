(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var initialized = false; // this boolean flag is used so we don't trigger the intialize function twice.

var hashID = null; role = 'prof';

if (window.location.hash.length > 1) { // check if the url contains a hash
    hashID = window.location.hash.substr(1, window.location.hash.length - 1);
    role = 'student';
}

// var lastPeerId = null;

// Create own peer object with connection to shared PeerJS server
peer = new Peer(null, {
    debug: 2
});

peer.on('open', function (id) {
    // Workaround for peer.reconnect deleting previous id
    // if (peer.id === null) {
    //     console.log('Received null id from peer open');
    //     peer.id = lastPeerId;
    // } else {
    //     lastPeerId = peer.id;
    // }

    console.log('ID: ' + peer.id);
    // if (role === 'student') {
    if (hashID) initializeConnection(hashID);
    // } else {
    //     //
    // }
    initializeQR(peer.id)
});

// peer.on('disconnected', function () {
//     status.innerHTML = "Connection lost. Please reconnect";
//     console.log('Connection lost. Please reconnect');

//     // Workaround for peer.reconnect deleting previous id
//     peer.id = lastPeerId;
//     peer._lastServerId = lastPeerId;
//     peer.reconnect();
// });
// peer.on('close', function () {
//     conn = null;
//     status.innerHTML = "Connection destroyed. Please refresh";
//     console.log('Connection destroyed');
// });
// peer.on('error', function (err) {
//     console.log(err);
//     alert('' + err);
// });











// if (!initialized) initialize(response.ip);
var conn;
function initializeConnection(targetId) {
    conn = peer.connect(targetId);
    betterLog("connection init", conn)
    // on open will be launch when you successfully connect to PeerServer
    conn.on('open', function () {
        betterLog("sending hi", conn.id)
        // here you have conn.id
        conn.send('hi!');
    });
}

peer.on('connection', function (conn) {
    conn.on('data', function (data) {
        // Will print 'hi!'
        betterLog(data);
    });
});

function sendMsg(msg) {
    if (conn != null) conn.send(msg);
}

function initializeQR(peerId) {

    console.log("Peer ID: " + peerId);
    $('#my-qr').html("Peer ID: " + peerId);

    new QRCode(document.getElementById("my-qr"),
        "http://169.233.126.117:8080#" + peerId);
    //https://people.ucsc.edu/~rykaande/
}

function betterLog(text1, text2) {
    $('body').append(text1).append(text2);
};
},{}]},{},[1]);
