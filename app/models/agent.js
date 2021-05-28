import { createPatch } from 'diff';
import Promise from 'bluebird';
let fs = Promise.promisifyAll(require('fs'));

class Agent {
  constructor() {
    console.log('Initialized detector agent...');
    this.url = 'https://nodejs.org/en/';
    this.path = '';
  }

  async get() {
    console.log('Get endpoint is invoked...');
    let patch = createPatch('Website Content Difference', 'Content Unavailable', 'Content Unavailable');
    try {
      const folderList = await fs.readdirAsync(`${this.path}/${encodeURIComponent(this.getUrl())}/`);
      if (folderList.length < 2) {
        return {patch, latestContent: null};
      } else {
        // Compares the index.html files in first two folders
        const index1 = await fs.readFileAsync(`${this.path}/${encodeURIComponent(this.getUrl())}/${folderList[0]}/index.html`).then((res) => res.toString());
        const index2 = await fs.readFileAsync(`${this.path}/${encodeURIComponent(this.getUrl())}/${folderList[1]}/index.html`).then((res) => res.toString());
        patch = createPatch('Website Content Difference', index1, index2);
        return {patch, latestContent: index2};
      }
    } catch (e) {
      console.log(e);
      return {patch, latestContent: null};
    }

  }

  config(url) {
    this.url = url;
  }

  getUrl() {
    return this.url;
  }
  setPath(path) {
    this.path = path;
  }
}

export default Agent;
