const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const expressHbs = require('express-handlebars');
const handlebars = require('handlebars');
const nodemailer = require('nodemailer'); //Sending password reset emails
const async = require('async'); //Avoid dealing with nested callbacks
const mongoose = require('mongoose');
const session = require('express-session');

//All these packages come from connectflash() package
const passport = require('passport'); //User Management, User Notification, Sign In, Sign Up
// const flash = require('connect-flash'); // Messages wrapped in routes, often shown in form validation

const flash = require('express-flash');
const crypto = require('crypto'); //Generating random token during password reset

const validator = require('express-validator');
const MongoStore = require('connect-mongo')(session); //Should be done after importing session module
// session out here is exported to a function
const indexRouter = require('./routes/index'); //Redirects app to the routes folder
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect('mongodb://localhost:27017/hackbattle');
// mongoose.connect('mongodb://admin:rjhaveri14@ds161335.mlab.com:61335/sigmatenant');


require('./config/passport'); //Variable Binding not required

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

handlebars.registerHelper('if_eq', function(a, b, opts) {
    if(a === b)
        return opts.fn(this);
    else
        return opts.inverse(this);
});


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
    secret: '#secretkey',
    resave: false,
    saveUnitialized: false,
    //Store out here stores the session on the server rather than the memory which might have lead to memory leaks
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    cookie: { maxAge: 180*10*1000 } //maxAge tells the session how long does it have before you are logged out
}));
//Resave true means that this session will be saved on a server on each request no matter any change
//saveUninitialized means that even if session is not initialized it will yet get saved


// Below middleware options should be done after session connect above
app.use(flash());
// app.use(eflash());
app.use(passport.initialize());
app.use(passport.session()); //Store the user session details

app.use(express.static(path.join(__dirname, 'public')));
app.set('javascripts', path.join(__dirname, 'public/javascripts'));
app.set('scripts', path.join(__dirname, 'public/autocomplete'));
//app.set('images', path.join(__dirname, 'public/images'));


app.use('/', indexRouter);
//The indexRouter is used later since all the requests coming to '/' would go to index.js

app.use('/scripts', express.static(__dirname + '/node_modules/easy-autocomplete/dist/'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    console.log(req);
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


// let port = process.env.PORT;
// if (port == null || port === "") {
//     port = 3021;
// }

app.listen(process.env.PORT || 80, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});


module.exports = app;

