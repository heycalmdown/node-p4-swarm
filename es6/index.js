import qs from 'qs';
import superagent from 'superagent-bluebird-promise';
import * as _ from 'lodash';

function body(agent) {
  return agent.then(o => o.body);
}
function qsArray(query) {
  return qs.stringify(query, {arrayFormat: 'brackets'});
}

// TODO
// getReviews + by project

// https://swarm.workshop.perforce.com/docs/api.endpoints.html
export default class Swarm {
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
  getReviewsOpened(opts) {
    return body(this.GET('reviews').query(qsArray({state: ['needsReview', 'needsRevision']}))).then(o => {
      o.reviews = o.reviews.filter(review => {
        if (opts.projects) {
          if (_.intersection(_.keys(review.projects), opts.projects).length === 0) return;
        }
        if (opts.votes) {
          let voted = _.filter(review.participants, p => {
            if (!p.vote) return;
            return p.vote.value === 1 && !p.vote.isStale;
          });
          if (voted.length < opts.votes) return;
        }
        if (!_.isUndefined(opts.committed)) {
          if (opts.committed && review.commits.length === 0) return;
          if (!opts.committed && review.commits.length !== 0) return;
        }
        return true;
      });
      return o;
    });
  }
  getReviewsAfter(revision) {
    return body(this.GET('reviews').query({after: revision}));
  }
  GET(url) {
    return this.request.get(this.baseUrl + '/api/' + this.version + '/' + url);
  }
}
