if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;
const ENV = process.env.ENV || 'development';

// DB Config:
const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig[ENV]);

// Server Config:
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(cookieParser(process.env.PASSPORT_SECRET));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport, knex);

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(express.json());

// SLAP Config:

const Slapp = require('slapp');
const ContextLookup = require('./slapp/context-lookup');

// Routing:

// SET VIEW ENGINE TO EJS FOR LANDING PAGE
app.set('view engine', 'ejs');
app.set('views');
app.use(express.static('public'));

const slapp = Slapp({
  context: ContextLookup(knex),
  verify_token: process.env.SLACK_VERIFY_TOKEN,
  log: true,
  colors: true,
});

// const friendbot = require('./slapp/friendbot');
// const doit = require('./slapp/justdoit');
// const yesno = require('./slapp/yesno');

// Handle direct messages that are kinda dumb:
// friendbot(slapp);
// doit(slapp);
// yesno(slapp);

slapp.attachToExpress(app);

app.get('/login', (req, res, next) => {
  res.render('home');
});

app.get('/logout', (req, res, next) => {
  res.clearCookie('jwt');
  res.redirect('/login');
});

const apiRouter = require('./routes/api');
app.use('/api', apiRouter(knex, slapp));

// Passport Login:
const authRouter = require('./routes/auth');
app.use('/auth', authRouter(knex));


// The 'catchall' handler for authenticating requests
app.get('*', passport.authenticate('jwt', {
  session: false,
  failureRedirect: '/login',
}), (req, res, next) => {
  next();
});


// The 'catchall' handler: for any request that doesn't
// match one above, send back React's index.html file.
// If it makes it past landing page, serve static files from React:
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', passport.authenticate('jwt', {
  session: false,
  failureRedirect: '/login',
}), (req, res) => {
  res.sendFile(path.join(`${__dirname}/client/build/index.html`));
});

app.listen(PORT);
console.log(`🚀 Server ready at http://localhost:${PORT}`);
