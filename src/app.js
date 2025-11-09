const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const winston = require('winston');
const expressWinston = require('express-winston');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
const { connectDB } = require('./config/database'); // Updated import
const corsConfig = require('./config/cors');
const errorHandler = require('./middlewares/errorHandler');
const rootRoutes = require('./routes/root.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const logger = require('./utils/logger');



const app = express();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Argent.A&M Website API', version: '1.0.0' },
  },
  apis: ['./src/routes/*.js'],
};
const swaggerSpecs = swaggerJsdoc(swaggerOptions);

const path = require('path');
const session = require('express-session');
const passport = require('passport');
const User = require('./models/User.model');
// Session and passport setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'argent_secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Connect MongoDB and import users from JSON
connectDB().then(async () => {
  const importUsersFromJson = require('./utils/importUsers');
  await importUsersFromJson();
});

// Add custom request ID middleware
app.use((req, res, next) => {
  try {
    logger.debug('Generating request ID with uuid');
    req.id = uuidv4();
    next();
  } catch (err) {
    logger.error('Failed to generate request ID: %s', err.message);
    next();
  }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
    },
  },
}));
app.use(corsConfig);
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
}));

// Performance
app.use(compression());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logger
app.use(morgan('dev'));
app.use(expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'logs/requests.log' }),
    ...(process.env.NODE_ENV !== 'production' ? [new winston.transports.Console()] : []),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}} [RequestID: {{req.id}}]',
  expressFormat: true,
  colorize: false,
}));


// Landing page route (rendered view)
app.get('/', (req, res) => {
  res.render('landing', { title: 'FindMe Argent', user: req.user });
});

// Auth routes
const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

// Main app routes
const mainRoutes = require('./routes/main.routes');
app.use('/main', mainRoutes);

// API Routes
app.use('/api', rootRoutes);

// Swagger API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Error logger
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'logs/errors.log' }),
    ...(process.env.NODE_ENV !== 'production' ? [new winston.transports.Console()] : []),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
}));

// Central error handler
app.use(errorHandler);

module.exports = app;