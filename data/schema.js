const typeDefinitions = `
type Author {
  id: Int
  firstName: String
  lastName: String
  posts: [Post]
}
type Post {
  id: Int
  title: String
  text: String
  views: Int
  author: Author
}

type Query {
  author(id: Int, firstName: String, lastName: String): Author
  authors(id: Int, firstName: String, lastName: String): [Author]
  post(id: Int, title: String, text: String): Post
  posts(id: Int, title: String, text: String): [Post]
  getFortuneCookie: String
}

schema {
  query: Query
}
`;

export default [typeDefinitions];
