require('dotenv/config'); // .env の環境変数の読み込み
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ApolloEngine } = require('apollo-engine');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const { APOLLO_ENGINE_API_KEY } = process.env;

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

// Apollo Engineのインスタンスの作成
const engine = new ApolloEngine({
  apiKey: APOLLO_ENGINE_API_KEY,
  // メモリキャッシュの設定
  stores: [
    {
      name: 'inMemEmbeddedCache',
      inMemory: {
        cacheSize: 104857600, // 100 MB、デフォルトは 50 MB
      },
    },
  ],
  logging: {
    level: 'INFO', // ログの設定変更。DEBUG にするとより細かい情報を確認できます
  },
});

// サーバの起動
engine.listen({
  port: 4000,
  expressApp: app,
});

module.exports = engine;
