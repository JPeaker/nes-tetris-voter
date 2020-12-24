import 'reflect-metadata';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { connection } from './data/config';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { BoardResolver } from './data/BoardResolver';
import { RelatedPossibilityResolver } from './data/RelatedPossibilityResolver';
import { filledGrid } from 'nes-tetris-representation';
import thumbnailCreator from './thumbnail-creator';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const main = async () => {
  await connection;
  const schema = await buildSchema({
    resolvers: [BoardResolver, RelatedPossibilityResolver],
    emitSchemaFile: true,
    validate: false,
  });

  const server = new ApolloServer({ schema, introspection: true });
  server.applyMiddleware({ app });
}

// tslint:disable-next-line:no-console
main().catch(error => console.log(error));

const getPage = (id: string, url: string, callback: (data: string) => void) => {
  const filePath = path.join(__dirname, '../build', 'index.html');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }

    data = data.replace(/{{thumbnailUrl}}/, `https://nes-tetris-voter.herokuapp.com/vote/${id}/thumbnail`);
    data = data.replace(/{{url}}/, `https://nes-tetris-voter.herokuapp.com${url}`);

    callback(data);
  });
};

app.get('/vote/:id/thumbnail', async (req, res) => {
  const boardResolver = new BoardResolver();
  const board = await boardResolver.board(req.params.id);

  const image = await thumbnailCreator(board ? board.board : filledGrid);

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': image.length,
  });
  res.end(image);
});

app.get('/', (req, res) => getPage(req.query.id as string, req.url, (data: string) => res.send(data)));

app.use(express.static(path.join(__dirname, '../build')));

app.get('/*', (req, res) => getPage(req.query.id as string, req.url, (data: string) => res.send(data)));

// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`Listening on port ${port}`));