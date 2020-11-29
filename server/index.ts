import 'reflect-metadata';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import { connection } from '../data/config';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { BoardResolver } from '../data/BoardResolver';

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const main = async () => {
  await connection;
  const schema = await buildSchema({
    resolvers: [BoardResolver],
    emitSchemaFile: true,
    validate: false,
  });

  const server = new ApolloServer({ schema });
  server.applyMiddleware({ app });
}


// tslint:disable-next-line:no-console
main().catch(error => console.log(error));

// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`Listening on port ${port}`));