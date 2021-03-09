require('dotenv').config()

// DATABASE CONNECTION
const connection = require('./model')


// ROUTES CONTROLLERS
const educatorController = require('./controllers/educators')
const adminController = require('./controllers/admin')


// BASIC
const express = require("express"),
    path = require('path'),
    bodyparser = require('body-parser'),
    app = express();
// Setting up environment
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
// app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }))
global.__basedir = __dirname;


// SOCIAL LOGINS
const passport = require('passport')
require('./google-passport-setup')
require('./facebook-passport-setup')
const cookieSession = require('cookie-session')
app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
}));
// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());
const { createConnection } = require("net");
// Auth middleware that checks if the user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login-signup');
}
app.get('/sociologin/:type/:usertype', (req, res) => {
    console.log(req.params.usertype)
    req.session.usertype = req.params.usertype
    if(req.params.type == 'facebook')
        res.redirect('/facebook')
    else
        res.redirect('/google')
})
// GOOGLE login
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
app.get('/google/callback', passport.authenticate('google', {    
    successRedirect: '/profile',
    failureRedirect: '/login-signup'
}));
// FACEBOOK login
app.get('/facebook', passport.authenticate('facebook', { scope: 'email' }))
app.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/login-signup'
}));



app.get('/', (req, res) => res.render('index'))
app.get('/about-us', (req, res) => res.render('about-us'))


const mongoose = require('mongoose'),
    multer = require('multer'),
    blogModel = mongoose.model('blogs');
var BIstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = __basedir + "/uploads/blogs/"
        return cb(null, dir)
    },
    filename: (req, file, cb) => {
        // var filename = file.fieldname + '.' + file.originalname.split('.')[1]
        cb(null, file.originalname);
    },

})
var uploadBI = multer({ storage: BIstorage });
module.exports = uploadBI;

app.get('/blogs', (req, res) => {
    blogModel.find({}, { 'btitle': 1, 'bdate': 1, 'bimage': 1 }, (err, docs) => {
        if (err) console.log(err)
        else {
            res.render('blogs', { 'blogs': docs })
        }
    })
})
app.get('/blogs/createNewBlog', (req, res) => {
    blogModel.find({}, {'btitle': 1, 'authorName': 1, 'bimage': 1 }).sort({'bdate': -1}).limit(3).exec(function (err, rBlogs) {
        if(err) {
            console.log(err)
            res.send(err)
        }
        else {
            res.render('blogPost', {'pagetype': 'create', 'blog': {}, 'email': req.user.emails[0].value, 'name': req.user.displayName, 'rblogs': rBlogs})
        }
    }) 
})
app.get('/blogs/:id', (req, res) => {
    blogModel.findOne({'_id': req.params.id}, (err, doc) => {
        if(err) {
            res.send(err)
        } else {
            blogModel.find({}, {'btitle': 1, 'authorName': 1, 'bimage': 1 }).sort({'bdate': -1}).limit(3).exec(function (err, rBlogs) {
                if(err) {
                    console.log(err)
                    res.send(err)
                }
                else {
                    console.log(rBlogs)
                    res.render('blogPost', {'pagetype': 'post', 'blog': doc, 'rblogs': rBlogs})
                }
            }) 
        }
    })
})
app.get('/getComments/:id', (req, res) => {
    blogModel.findOne({'_id': req.params.id}, {'comments': 1}, (err, comm) => {
        if(err) {
            res.send(err)
        } else {
            console.log(comm)
            res.send(comm)
        }
    })
})
app.post('/postComment/:id', (req, res) => {
    console.log(req.body)
    var md = {}
    var matches = req.body.name.match(/\b(\w)/g)
    var comKey = matches.join('')
    var char = 'abcdefghijklmnopqrstuvwxyzQWERTYUIOPLKJHGFDSAZXCVBNM0123456789!@?%^&*';
    var charLen = char.length;
    for (var i = 0; i < 5; i++) {
        comKey += char.charAt(Math.floor(Math.random() * charLen));
    }
    console.log(comKey);
    var mdkey = 'comments.'+comKey
    md[mdkey] = {'name': req.body.name, 'comment': req.body.comment, 'date': new Date()}
    var newVal = { $set: md }
    blogModel.updateOne({'_id': req.params.id}, newVal, (err, user) => {
        if(err) {
            res.send(err)
        } else {
            if(user['ok'] == 1) {
                res.send('success')
            } else {
                res.send('error while saving')
            }
        }
    })
})
app.post('/save/blogPost', uploadBI.single("blogimage"), (req, res) => {
    var newBlog = new blogModel()
    newBlog.btitle = req.body.title
    newBlog.authorName = req.body.authorName
    newBlog.authorEmail = req.body.authorEmail
    newBlog.bcontent = req.body.blogPost
    newBlog.bimage = req.file.originalname
    newBlog.bdate = new Date()
    newBlog.save((err, doc) => {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            console.log(doc)
            res.send('success')
        }
    });
})

app.get('/courses', (req, res) => res.render('OEcontroller', {'msg': 'soon', 'page': 'Courses'}))
app.get('/career', (req, res) => res.render('OEcontroller', {'msg': 'soon', 'page': 'Career'}))
app.get('/learn-as-student', (req, res) => res.render('OEcontroller', {'msg': 'soon', 'page': 'Student'}))
app.get('/login-signup', (req, res) => {
    if(req.session.email)
        res.redirect('/be-an-educator/dashboard/home')
    // else if(req.session.admin)
    //     res.redirect('/admin/dashboard/educators')
    else {
        req.logout();
        req.session.name = ''
        req.session.courseId = ''    
        res.render('signin-signup')    
    }
})


// ROUTES
app.use('/be-an-educator', educatorController)
app.use('/admin', adminController)

app.get('/profile', isLoggedIn, function(req, res) {
    console.log('session ====' + req.session.usertype)
    if(req.session.usertype == 'educator')
        res.redirect('/be-an-educator/social-login')
    else if (req.session.usertype == 'student')
        res.send('stu login')
    else
        res.redirect('/blogs/createNewBlog')
});




// LOGOUT
app.get('/logout', function(req, res) {
    req.logout();
    req.session.admin = ''
    req.session.email = ''
    req.session.name = ''
    req.session.courseId = ''
    res.redirect('/');
});


// 404 Error
app.use((req, res) => {
    res.status(404).send('not found')
})

// MIDDLEWARE
app.listen(process.env.PORT || 5000, () => {
    console.log(`App Started on PORT ${process.env.PORT || 5000}`);
});