const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const cors=require('cors')

const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').MongoURI;
const bodyParser = require('body-parser');

app.use(cors())
// Connect to MongoDB
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

// // EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Express body parser
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json())

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
})); 

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes

app.use('/api',require('./api/index'))
app.use('/users', require('./routes/users.js'));
app.use('/', require('./routes/index.js'));

app.listen(3000, () => {
    console.log("server running on 3000")
})
