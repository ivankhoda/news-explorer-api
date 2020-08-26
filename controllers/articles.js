const Article = require('../models/article');
const NotFoundError = require('../midllewares/errors/NotFoundError');
const BadRequest = require('../midllewares/errors/BadRequest');
const Forbidden = require('../midllewares/errors/Forbidden');

module.exports.getArticle = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then(
      (article) => {
        if ((!article) || (article.length === 0)) {
          throw new NotFoundError('Нет статей для отображения');
        }
        res.send({ data: article });
      },
    )
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;
  if (!req.body) {
    throw new BadRequest('Ни одно из вводимых полей не может быть пустым');
  }
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then(
      (article) => { res.send({ data: article.toJSON() }); },
      (err) => {
        throw new BadRequest(`${err}`);
      },
    )
    .catch(next);
};

module.exports.deleteArticleById = (req, res, next) => {
  const { id } = req.params;
  if (!req.params) {
    throw new BadRequest('Ни одно из вводимых полей не может быть пустым');
  }
  Article.findOne({ _id: id })

    .then((result) => {
      if ((!result) || (result.length === 0)) { throw new NotFoundError(`Статья ${id} не существует`); } else if (req.user._id === result.owner._id.toString()) {
        Article.deleteOne({ _id: id })
          .then(() => {
            res.send({ message: 'Статья удалена' });
          }, (err) => {
            console.log(err);
          })
          .catch(next);
      } else if (req.user._id !== (result.owner._id.toString())) {
        throw new Forbidden('Нет прав для удаления статьи');
      }
    })

    .catch(next);
};
