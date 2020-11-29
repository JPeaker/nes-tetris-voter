import "reflect-metadata";
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import { pool } from './config';
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { BoardResolver } from '../schema/BoardResolver';
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const main = async () => {
  const schema = await buildSchema({
    resolvers: [BoardResolver],
    emitSchemaFile: true,
    validate: false,
  });

  const server = new ApolloServer({ schema });
  server.applyMiddleware({ app });
  console.log('Agghgh');
}


// tslint:disable-next-line:no-console
main().catch(error => console.log(error));

// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/hello', (_req, res) => {
  res.send('Hello you!');
});

app.route('/boards').get((_request, response) => {
  pool.query('SELECT * FROM boards', (error, results) => {
    if (error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
});