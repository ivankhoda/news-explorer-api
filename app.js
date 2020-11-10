const express = require('express');

const { PORT = 3000, DATABASE, NODE_ENV } = process.env;
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { requestLogger, errorLogger } = require('./midllewares/logger');
require('dotenv').config();

const dbUrl = (NODE_ENV === 'production' ? DATABASE : 'mongodb://localhost:27017/newsdb');
const routeToArticles = require('./routes/articles');
const routeToUser = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./midllewares/auth');
const NotFoundError = require('./midllewares/errors/NotFoundError');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.use(cookieParser());

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);

const allowedOrigins = [
  'http://localhost:8081',
  'https://ivankhoda.github.io/news-explorer-frontend/',

];
app.use(cors(
  {
    origin(origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not '
          + 'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    exposedHeaders: ['Content-Length'],
    credentials: true,
  },
));
// app.use(cors());
// app.options('*', cors());

app.post('/api/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    }),
  }),

  login);

app.post('/api/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    }),
  }),

  createUser);

app.use(auth);
app.use('/', routeToUser, routeToArticles);

app.use(errorLogger);

app.use(errors());

app.use('/', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});

app.listen(PORT, () => {
  console.info(`App listening on port ${PORT}`);
});
