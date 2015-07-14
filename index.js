import qs from 'qs';
import superagent from 'superagent-bluebird-promise';
import _ from 'lodash';
import config from './config.js';

function body(agent) {
  return agent.then(o => o.body);
}
function qsArray(query) {
  return qs.stringify(query, {arrayFormat: 'brackets'});
}

class Swarm {
  constructor(baseUrl, version) {
    this.baseUrl = baseUrl;
    this.version = version;
    this.request = superagent.agent();
  }
  getProject() {
    return this.GET('projects');
  }
  getReview(id, fields) {
    let and = this.GET('reviews/' + id);
    if (fields && fields.length) {
      and.query({fields: fields.join(',')});
    }
    return body(and);
  }
  getReviewsAll() {
    return body(this.GET('reviews'));
  }
  getReviewsOpened() {
    return body(this.GET('reviews').query(qsArray({state: ['needsReview', 'needsRevision']})));
  }
  getReviewsAfter(revision) {
    return body(this.GET('reviews').query({after: revision}));
  }
  GET(url) {
    return this.request.get(this.baseUrl + '/api/' + this.version + '/' + url);
  }
}

let swarm = new Swarm(config.baseUrl, config.version);
swarm.getReviewsOpened().then(o => console.log(o.reviews.length, _.max(_.pluck(o.reviews, 'id'))));