import Sequelize from 'sequelize';
import casual from 'casual';
import _ from 'lodash';
import Mongoose from 'mongoose';
import rp from 'request-promise';

import _cfg from '../config/config'

const db = new Sequelize(_cfg.db, _cfg.user, _cfg.pass, {
  host: _cfg.host,
  dialect: _cfg.dialect,

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

const AuthorModel = db.define('author', {
  firstName: { type: Sequelize.STRING },
  lastName: { type: Sequelize.STRING },
});

const PostModel = db.define('post', {
  // id: { type: Sequelize.INTEGER, primaryKey: true },
  title: { type: Sequelize.STRING },
  text: { type: Sequelize.STRING },
});

AuthorModel.hasMany(PostModel);
PostModel.belongsTo(AuthorModel);

// views in mongo DB

const mongo = Mongoose.connect('mongodb://localhost/views');

const ViewSchema = Mongoose.Schema({
  postId: Number,
  views: Number,
});

const View = Mongoose.model('views', ViewSchema);


casual.seed(123);
db.sync({ force: true }).then(() => {
  // we are using the then() function to populate sample data
  // to our database. 
  _.times(5, () => {
    return AuthorModel.create({
      firstName: casual.first_name,
      lastName: casual.last_name,
    }).then((author) => {
      return _.times(5, (i) => {
        author.createPost({
          title: `A post by ${author.firstName} [${i}]`,
          text: casual.sentences(3),
        }).then((post) => {
          return View.update(
            { postId: post.id },
            { views: casual.integer(0, 100) },
            { upsert: true });
        })
      });
    });
  });
});

const Author = db.models.author;
const Post = db.models.post;

const FortuneCookie = {
  getOne() {
    return rp('http://fortunecookieapi.com/v1/cookie')
      .then((res) => JSON.parse(res))
      .then((res) => {
        return res[0].fortune.message;
      });
  },
};


export { Author, Post, View, FortuneCookie };