let express = require('express');
let request = require('request');

app = express();
app.use(express.static('www'));

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

CLIENT_ID = process.env.CLIENT_ID;
CLIENT_SECRET = process.env.CLIENT_SECRET;
ACCESS_TOKEN = null;

// API Routes
// app.get('/blah', routeHandler);

app.set('port', process.env.PORT || 5000);

let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))},
    form: {
        grant_type: 'client_credentials'
    },
    json: true
};
request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        ACCESS_TOKEN = body.access_token;
        console.log(ACCESS_TOKEN);
    }
});

app.get('/getTrack/:id', function (rq, res) {
    let requestionOptions = {
        url: `https://api.spotify.com/v1/tracks/${rq.params.id}`,
        headers: {'Authorization': `Bearer  ${ACCESS_TOKEN}`},
        json: true
    };
    request.get(requestionOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        }
    });
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
