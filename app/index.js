import express from 'express';
import compression from 'compression';
import cors from 'cors';
// import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
let fs = Promise.promisifyAll(require('fs'));
import cron from 'node-cron';
import scrape from 'website-scraper'; // only as ESM, no CommonJS
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
const mainPath = path.join(__dirname, '../');
agent.setPath(mainPath);


cron.schedule('* * */4 * * *', () => {
  console.log('running a task every four hour');
  const directory = `${mainPath}/websites/${encodeURIComponent(agent.getUrl())}/${new Date().getTime()}`;
  const options = {
    urls: [agent.getUrl()],
    directory,
    sources: [
      { selector: 'body' }
    ],
  };
  scrape(options).then((result) => {

  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port 3000!');
});
