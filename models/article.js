const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: [true, 'Это обязательное поле'],
  },
  title: {
    type: String,
    required: [true, 'Это обязательное поле'],
  },
  text: {
    type: String,
    required: [true, 'Это обязательное поле'],
  },
  date: {
    type: String,
    required: [true, 'Это обязательное поле'],
  },
  source: {
    type: String,
    required: [true, 'Это обязательное поле'],
  },
  link: {
    type: String,
    required: [true, 'Введите валидную ссылку, пожалуйста'],
    validate: {
      validator(v) {
        return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w-]+)+[\w\-_~:/?#[\]@!&',;=]+$/.test(v);
      },
      message: 'Ссылка должна быть валидной.',
    },
  },
  image: {
    type: String,
    required: [true, 'Введите валидную ссылку, пожалуйста'],
    validate: {
      validator(v) {
        return /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/.test(v);
      },
      message: 'Ссылка на картинку, должна быть валидной.',
    },
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

articleSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.owner;
  return obj;
};

module.exports = mongoose.model('Article', articleSchema);
