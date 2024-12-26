// Requiring NPM Modules that we need
const express = require('express'),
mongoose = require('mongoose'),
bodyParser = require('body-parser'),
session = require('express-session'),
ejs = require('ejs'),
passport = require('passport'),
app = express();

// Requiring Routes
const baseRoutes = require('./Controllers/Routes/base.routes');
const userRoutes = require('./Controllers/Routes/user.routes'),
localRoutes = require('./Controllers/Routes/local.routes'),
articleRoutes = require('./Controllers/Routes/article.routes'),
fbRoutes = require('./Controllers/Routes/fb.routes');

// Additional configs
const key = require('./key'),
db = key.db.remote || 'mongodb://localhost/' + key.db.local,
port = process.env.PORT || 3000;

// Connecting to Mongoose
mongoose.connect(db);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(session({ secret: key.session.secret}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// SETTING UP THE ROUTES
app.use('/', baseRoutes);
app.use('/auth/local', localRoutes);
app.use('/auth/facebook', fbRoutes);
app.use('/post', articleRoutes);
app.use('/user', userRoutes);

app.listen(port, (err) => {
    if(!err) {
        console.log('listening on port: ', port);
    } else {
        console.log('some error has occurred', err);
    }
}) 
