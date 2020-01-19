var possibleEmojis = [
    '🐀', '🐁', '🐭', '🐹', '🐂', '🐃', '🐄', '🐮', '🐅', '🐆', '🐯', '🐇', '🐐', '🐑', '🐏', '🐴',
    '🐎', '🐱', '🐈', '🐰', '🐓', '🐔', '🐤', '🐣', '🐥', '🐦', '🐧', '🐘', '🐩', '🐕', '🐷', '🐖',
    '🐗', '🐫', '🐪', '🐶', '🐺', '🐻', '🐨', '🐼', '🐵', '🙈', '🙉', '🙊', '🐒', '🐉', '🐲', '🐊',
    '🐍', '🐢', '🐸', '🐋', '🐳', '🐬', '🐙', '🐟', '🐠', '🐡', '🐚', '🐌', '🐛', '🐜', '🐝', '🐞',
];

module.exports.randomEmoji = function () {
    const randomIndex = Math.floor(Math.random() * possibleEmojis.length);
    return possibleEmojis[randomIndex];
}

module.exports.betterLog = function (text1, text2) {
    console.log(text1, text2)
    $('#console_msgs').append(text1).append(", ").append(text2).append(document.createElement("br"));
};

module.exports.shortenLink = function (longLink, callbackFunc) {
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