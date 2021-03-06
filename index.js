/**
 * Project: HSR CAS FEE 2017, Project 02 - give-it-away application.
 * Content: Node Express Webserver for the give-it-away application.
 * Created on: 12.12.2017
 * Author: Saidul Hofmann
 */

// Declarations
//-----------------------------------------------------------------------------
const express = require('express');
const app = express();
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./data/mongodb');
//const jwt = require('express-jwt');
//const jwtSecret = 'aklsdjfklöasjdcma8sd90mcklasdföasdf$ädasöfü pi340qkrlöam,dflöäasf';


// Aplication settings
//-----------------------------------------------------------------------------
//app.set("jwt-secret", jwtSecret); //secret should be in a config file - or better be a private key!
//app.set("jwt-sign", {expiresIn: "1d", audience: "self", issuer: "myself"});
//app.set("jwt-validate", {secret: jwtSecret, audience: "self", issuer: "myself"});
//

// Database settings
//-----------------------------------------------------------------------------

mongoose.Promise = global.Promise;
mongoose.connect(config.DB).then(
    () => {console.log('Database is connected') },
err => { console.log('Can not connect to the database'+ err)}
);

// Middleware configuration
//-----------------------------------------------------------------------------
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/../give-it-away-frontend/dist')));

// app.get("/", function (req, res) {
//     res.sendFile("index.html", {root: __dirname + '/../give-it-away-frontend/dist/'});
// });

//app.use("/", require('./routes/userRoutes.js'));
//app.use(jwt(app.get("jwt-validate"))); //after this middleware a token is required!
app.use("/articles", require('./routes/articleRoutes.js'));

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('No token / Invalid token provided');
    }
    else {
        next(err);
    }
});


// Start Webserver
//-----------------------------------------------------------------------------
const hostname = '127.0.0.1';
const port = 3003;
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


