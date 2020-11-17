import bodyParser from 'body-parser';
import express from 'express';

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/hello', (_req, res) => {
  // tslint:disable-next-line:no-console
  res.send('Hello you!');
});