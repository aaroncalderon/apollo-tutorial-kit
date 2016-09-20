import { Author, Post, View, FortuneCookie } from './connectors';

const resolvers = {
  Query: {
    author(_, args) {
      console.log("[author] find \n", args);
      return Author.find({ where: args });
    },
    post(_, args) {
      console.log("[post] find \n", args);
      return Post.find({ where: args });
    },
    getFortuneCookie(){
      return FortuneCookie.getOne();
    }
  },
  Author: {
    posts(author) {
      return author.getPosts();
    },
  },
  Post: {
    author(post) {
      return post.getAuthor();
    },
    views(post) {
      return View.findOne({ postId: post.id }).then((view) => view.views);
    },
  },
};

export default resolvers;