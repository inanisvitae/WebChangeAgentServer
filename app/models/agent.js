import { createPatch } from 'diff';
import format from 'html-format';
import Promise from 'bluebird';
let fs = Promise.promisifyAll(require('fs'));

class Agent {
  constructor() {
    console.log('Initialized detector agent...');
    this.url = 'https://www.cnbc.com/world/?region=world';
    this.path = '';
    this.websitePath = '';
    this.diffsPath = '';
  }

  async get(url, { dates: { startDate, endDate } }) {
    console.log(url, startDate, endDate, startDate > endDate);
    if (!url || !startDate || !endDate || (startDate > endDate)) {
      console.log('here..');
      return null;
    }
    try {
      const patch = await fs.readFileAsync(`${this.diffsPath}/${url}/${startDate}-${endDate}`);
      if (patch.toString()) {
        return { patch: patch.toString() };
      }
    } catch (e) {
      console.log('Probably the requested diffId does not exist on disk... Go for patch creation');
    }
    console.log('Get endpoint is invoked...');
    let patch = createPatch('Website Content Difference', 'Content Unavailable', 'Content Unavailable');
    try {
      const index1 = format(await fs.readFileAsync(`${this.websitePath}/${url}/${startDate}/index.html`).then((res) => res.toString()).catch((res) => ''));
      const index2 = format(await fs.readFileAsync(`${this.websitePath}/${url}/${endDate}/index.html`).then((res) => res.toString()).catch((res) => ''));
      patch = createPatch('Website Content Difference', index1, index2);

      // Should generate the patch and write it to disk for comparison
      await fs.mkdirAsync(`${this.diffsPath}/${url}/`).then(() => {
        console.log('Made a dir..');
      }).catch((e) => {
        console.log('Error in making dir');
        console.log(e);
      });
      await fs.writeFileAsync(`${this.diffsPath}/${url}/${startDate}-${endDate}`, patch).then(() =>{
        console.log('Wrote a patch to the directory...');
      }).catch((e) => {
        console.log('Error in writing file');
        console.log(e);
      });
      return { patch };
    } catch (e) {
      console.log(e);
      return { patch };
    }

  }

  async content(url, date) {
    try {
      const strResult = await fs.readFileAsync(`${this.websitePath}/${url}/${date}/index.html`).then((res) => res.toString()).catch((e) => {
        throw e;
      });
      return strResult;
    } catch(e) {
      return null;
    }
  }

  async directory() {
    const folderList = (await fs.readdirAsync(`${this.websitePath}/`)) || [];
    if (folderList.length > 0) {
      const resultDir = {};
      const promisesList = [];
      folderList.forEach(async (subFolder) => {
        promisesList.push(fs.readdirAsync(`${this.websitePath}/${subFolder}/`));
      });
      const subFolderList = await Promise.all(promisesList);
      for (let i = 0; i < folderList.length; i++) {
        const folder = folderList[i];
        const subFolder = subFolderList[i];
        resultDir[folder] = subFolder;
      }
      return resultDir;
    }
    return null;
  }

  config(url) {
    console.log('A new url is set: ' + url);
    this.url = url;
    return true;
  }

  getUrl() {
    return this.url;
  }
  setPath(path) {
    this.path = path;
    this.websitePath = `${this.path}websites`;
    this.diffsPath = `${this.path}diffs`;
  }
}

export default Agent;
