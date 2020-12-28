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
import { filledGrid, Piece } from 'nes-tetris-representation';
import thumbnailCreator from './thumbnail-creator';
import fs from 'fs';
import discord from './discord';

const app = express();
const port = process.env.PORT || 5000;
const location = process.env.NODE_ENV === 'production' ? 'https://nes-tetris-voter.herokuapp.com' : 'http://localhost';
const ADMIN_AUTH = process.env.ADMIN_AUTH;

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

  const server = new ApolloServer({
    schema,
    introspection: true,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      const isAdmin = token === ADMIN_AUTH;
      return { isAdmin };
    }
  });
  server.applyMiddleware({ app });
}

// tslint:disable-next-line:no-console
main().catch(error => console.log(error));

const getPage = (id: string, url: string, callback: (data: string) => void) => {
  console.log('GET PAGE', url);
  const filePath = path.join(__dirname, '../build', 'index.html');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }

    data = data.replace(/{{title}}/, `NES Tetris: Vote #${id}`);
    data = data.replace(/{{thumbnailUrl}}/, `${location}/vote/${id}/thumbnail`);
    data = data.replace(/{{url}}/, `${location}${url}`);

    callback(data);
  });
};

app.get('/vote/:id/thumbnail', async (req, res) => {
  const boardResolver = new BoardResolver();
  const board = await boardResolver.board(req.params.id);

  const adjustedGrid = board ? board.board : filledGrid;
  const adjustedCurrent = board ? board.currentPiece : Piece.J;
  const adjustedNext = board ? board.nextPiece : Piece.L;
  const image = await thumbnailCreator(adjustedGrid, adjustedCurrent, adjustedNext);

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': image.length,
  });
  res.end(image);
});

app.use('/api/discord', discord);

app.get('/', (req, res) => getPage(req.query.id as string, req.url, (data: string) => res.send(data)));

app.use(express.static(path.join(__dirname, '../build')));

app.get('/*', (req, res) => getPage(req.query.id as string, req.url, (data: string) => res.send(data)));

// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`Listening on port ${port}`));