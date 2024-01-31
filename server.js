const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const path = require('path');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Import routes, database connection, and helpers
const routes = require('./controllers');
const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3001;

// Session configuration
const sess = {
  secret: 'Super secret secret', // Remember to move this to an environment variable in production
  cookie: {
    maxAge: 60 * 60 * 1000,  // Session expires after 1 hour
    httpOnly: true,          // Cookie is only accessible over HTTP(S)
    secure: false,           // Cookie can be sent over both HTTP and HTTPS
    sameSite: 'strict',      // Cookie is sent only when request comes from the same site
  },
  resave: false, 
  saveUninitialized: true, 
  rolling: true, // Reset maxAge on every response | Prevents timeout while user is active
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// Handlebars setup with custom helpers
const hbs = exphbs.create({ helpers });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder setup
app.use(express.static(path.join(__dirname, 'public')));

// Importing routes
app.use(routes);

// Sequelize database sync and server start
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () =>
    console.log(`\nServer running on port ${PORT}. Visit http://localhost:${PORT} and create an account!`)
  );
});
