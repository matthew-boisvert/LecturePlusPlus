
$.get("https://ipinfo.io", function(response) { 
    initialize(response.ip); 
}, "json") ;


function initialize(ip) {
    console.log(ip);
    $('#my-qr').html(ip);
}