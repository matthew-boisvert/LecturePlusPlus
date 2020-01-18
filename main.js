
var initialized = false; // this boolean flag is used so we don't trigger the intialize function twice.

$.get("https://ipinfo.io", function(response) { 
    if(!initialized) initialize(response.ip); 
}, "json") ;


function initialize(ip) {

    console.log(ip);
    $('#my-qr').html(ip);

    new QRCode(document.getElementById("my-qr"), "http://jindo.dev.naver.com/collie");
}