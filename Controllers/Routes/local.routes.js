//localhost:3000/auth/local/<Route>
const Router = require('express').Router(),
	bcrypt 	 = require('bcryptjs'),
	User = require('../../Models/user.model'),
	salt 	 = bcrypt.genSaltSync(10),
	nodemailer = require('nodemailer'),
	key = require('../../key');


var client = nodemailer.createTransport({
 service: 'SendGrid',
 auth: {
   user: key.sendGrid.username,  
   pass: key.sendGrid.password  
}
});


Router.post('/signup',(req,res) => {
	let errors = [];
	let usernameAlreadyChosen = false;
	let usernameIsGood = req.body.username.length > 0;
	let passwordIsGood = req.body.password.length > 0;
	let emailIsGood = req.body.email.length > 0;
	if(!usernameIsGood) errors.push('username field must be filled');
	if(!passwordIsGood) errors.push('password field must be filled');
	if(!emailIsGood) errors.push('email field must be filled');

	User.findOne({ username: req.body.username }).then((user) => {
		if(user){
			usernameAlreadyChosen = true;
			errors.push('username',req.body.username,'is already in use');
		}else{
			usernameAlreadyChosen = false;
		}
	}).then(() => {
		if(errors.length > 0) {
			res.render('signup',{errors,})
		}else{
			let newuser = new User;
			newuser.username = req.body.username;
			newuser.email = req.body.email;
			newuser.password = bcrypt.hashSync(req.body.password,salt);
			newuser.profile_pic = req.body.profile_pic;

			newuser.followers.push(req.body.username);
			newuser.people_you_are_following.push(req.body.username);
			newuser.save((user) =>{
				req.session.user = user;
                res.redirect('/dashboard');
			}).then(() => {

				let email = {   
					from: key.sendGrid.username, 
					to: newuser.email,
					subject: 'Welcome to Node Blogger',
					html: '<h2>Welcome to Node Blogger</h2><br/><p>Thank you for signing up with node blogger</p>' 
				};
				client.sendMail(email, function(err, info){
					console.log('Message sent: ' + info.response);
				});


			})
		}
	}) //end of then
}) // end of route


Router.post('/login',(req,res) => {
	let errors = [];
	User.findOne({ username: req.body.username }).then((user) => {
		let userExists = user;
		if(userExists && (bcrypt.compareSync(req.body.password, user.password) === true)){
			req.session.user = user;
	 		res.redirect('/dashboard');
		}else{
			errors.push('could not log in');
			res.render('login',{errors,})
		}
	}).catch((err) => {
		errors.push('user does not exist');
		res.render('login',{errors,});
	})

})


module.exports = Router;