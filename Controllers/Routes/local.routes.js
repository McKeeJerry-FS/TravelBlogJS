// localhost:3000/auth/local/<Route>
const Router = require('express').Router;

Router.post('/signup', (req, res) =>{
    let errors = [];
    let userNameAlreadyChosen = false;
    let userNameIsGood = req.body.username.length > 0;
    let passwordIsGood = req.body.password.length > 0;
    let emailIsGood = req.body.email.length > 0;
    if(!userNameIsGood){
        errors.push('Username is required');
    };
    if(!passwordIsGood){
        errors.push('Password is required');
    };
    if(!emailIsGood){
        errors.push('Email is required');
    };
    User.findOne({username: req.body.username}).then((user) =>{
        if(user){
            userNameAlreadyChosen = true;
            errors.push('Username', req.body.username,' is already in use');
        } else {
            userNameAlreadyChosen = false;
        }
    })
    .then(() =>{
        if(errors.length > 0){
            res.render('signup', {errors,});
        } else {
            let newUser = new User();
            newUser.username = req.body.username;
            newUser.email = req.body.email;
            newUser.password = bcrypt.hashsync(req.body.password, salt);
            newUser.profile_pic = req.body.profile_pic;
            newUser.followers.push(req.body.username);
            newUser.people_you_are_following.push(req.body.username);

            newUser.save((user) =>{
                req.session.user = user;
                res.redirect('/dashboard');
            });
        }
    });
});

module.exports = Router();