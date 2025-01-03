/* REQUIRING NPM MODULES WE NEED: */
const express 	= require('express'),
	mongoose 	= require('mongoose'),
	bodyParser  = require('body-parser'),
	session 	= require('express-session'),
	ejs 		= require('ejs'),
	passport	= require('passport'),
	app	  		= express();

/* REQUIRING OUR ROUTE FILES: */
const baseRoutes	= require('./Controllers/Routes/base.routes'),
	userRoutes  	= require('./Controllers/Routes/user.routes'),
	localRoutes 	= require('./Controllers/Routes/local.routes'),
	articleRoutes	= require('./Controllers/Routes/article.routes'),
	fbRoutes		= require('./Controllers/Routes/fb.routes');

/* ADDITIONAL CONFIG AND OTHER SETTINGS: */
const key = require('./key'),
	db	  = key.db.remote || 'mongodb://127.0.0.1:27017/' + key.db.local,
	port  = process.env.PORT || 3000;
        
    require('dotenv').config();

/* CONNECTING TO MONGOOSE: */
mongoose.connect(db);

/* SETTING UP OUR APP WITH REQ.BODY AND REQ.SESSION/PASSPORT AND OUR VIEW ENGINE = EJS AND SETTING OUR PUBLIC (CSS,JS AND IMGS TO GO TO THE 'PUBLIC' FOLDER): */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(session({ secret: key.session.secret }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.set('view engine','ejs');

/* SETTING UP OUR ROUTES*/
app.use('/',baseRoutes);
app.use('/auth/local',localRoutes);
app.use('/auth/facebook',fbRoutes);
app.use('/article',articleRoutes);
app.use('/user',userRoutes);


app.listen(port,(error) => {
	if(!error){
		console.log('listening on port:',port);
	}else{
		console.log('some error occured:',error);
	}
})