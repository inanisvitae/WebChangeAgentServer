import express from 'express';
import compression from 'compression';
import cors from 'cors';
import routes from './routes';
import Agent from './models/agent';

const app = express();
app.use(cors());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
const agent = new Agent();
app.use(routes(agent));

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
