const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const NotFoundError = require('../midllewares/errors/NotFoundError');
const BadRequest = require('../midllewares/errors/BadRequest');
const NotUnique = require('../midllewares/errors/NotUnique');
const NotAuthorized = require('../midllewares/errors/NotAutorized');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = (req, res, next) => {
  user.findOne({ _id: req.user._id })
    .then(
      (users) => {
        if ((!users) || (users.length === 0)) {
          throw new NotFoundError('Нет зарегистрированных пользователей');
        }
        res.send({ data: users });
      },
    )
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => user.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((result) => {
      res.status(201).send({ data: result.toJSON() });
    }, (err) => {
      if (err.errors.email && err.errors.email.kind === 'unique') {
        throw new NotUnique(`Пользователь с  email ${err.errors.email.value} уже зарегистрирован`);
      }
      throw new BadRequest(`${err}`);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return user.findUserByCreds(email, password)
    .then((u) => {
      res.send({
        token: jwt.sign(
          { _id: u._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          { expiresIn: '7d' },
        ),
      });
    }, (err) => {
      throw new NotAuthorized(`${err}`);
    })
    .catch(next);
};
