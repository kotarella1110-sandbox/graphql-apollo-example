const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

// モックデータ
const books = [
  {
    title: "Harry Potter and the Sorcerer's stone",
    author: 'J.K. Rowling',
    price: 2000,
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
    price: 3000,
  },
];

// GraphQL のスキーマ情報
const typeDefs = `
  type Query {
    books: [
      Book
    ]
  }
  type Book {
    title: String,
    author: String,
    price: Int
  }
`;

// resolver（データ処理）の設定
// DB からデータを取得したり、API を呼び出したりする処理もここで記述
const resolvers = {
  Query: {
    books: () => books,
  },
};

// GraphQL の Schema 設定
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Express の初期化
const app = express();

// CORS の設定
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
// GraphQL のエンドポイントの追加
app.use(
  '/graphql',
  bodyParser.json(),
  cors(corsOptions),
  graphqlExpress({
    schema,
  })
);

// GraphQL のエンドポイントの追加（テストで使う GraphQL の Web GUI）
app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
  })
);

// サーバの起動
app.listen(4000, () => {
  console.log('Go to http://localhost:4000/graphiql to run queries!');
});

module.exports = app;
