module.exports = function(app, request) {
    var apiUrl = 'http://github/chat-nodejs.local/src/backend/';
    var headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    var options = {};

    app.post('/api/login', function (req, res) {
        var options = {
            url: apiUrl + 'login',
            method: 'POST',
            headers: headers,
            qs: {'login': req.body.login, 'password': req.body.password}
        };

        request(options, function (error, response, body) {
            res.send(body);
        });
    });

    app.post('/api/registration', function (req, res) {
        var options = {
            url: apiUrl + 'registration',
            method: 'POST',
            headers: headers,
            qs: {'login': req.body.login, 'password': req.body.password}
        };

        request(options, function (error, response, body) {
            res.send(body);
        });
    });
};