import superagent from 'superagent-bluebird-promise';
import config from './config.js';

class Swarm {
  constructor(baseUrl, version) {
    this.baseUrl = baseUrl;
    this.version = version;
    this.request = superagent.agent();
  }
  getProject() {
    return this.request.get(this.baseUrl + '/api/' + this.version + '/projects');
  }
}

let swarm = new Swarm(config.baseUrl, config.version);
swarm.getProject().then(result => {
  console.log(result.body);
}).catch(err => console.log(err));
