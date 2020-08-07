const routerToArticles = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getArticle, createArticle, deleteArticleById } = require('../controllers/articles');

routerToArticles.get('/articles',
  celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string().required(),
    }).unknown(true),
  }),

  getArticle);

routerToArticles.post('/articles',
  celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string().required(),
    }).unknown(true),
    body: Joi.object().keys({
      keyword: Joi.string().required().min(2),
      title: Joi.string().required().min(2),
      text: Joi.string().required().min(2),
      date: Joi.string().required().min(2),
      source: Joi.string().required().min(2),
      link: Joi.string().required().min(2).regex(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w-]+)+[\w\-_~:/?#[\]@!&',;=]+$/),
      image: Joi.string().required().min(2).regex(/(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/),
    }),
  }),

  createArticle);

routerToArticles.delete('/articles/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
    headers: Joi.object().keys({
      authorization: Joi.string().required(),
    }).unknown(true),
  }),

  deleteArticleById);

module.exports = routerToArticles;
