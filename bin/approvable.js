#!/usr/bin/env babel-node
import Swarm from '../es6/index';
import config from './config.js';
import _ from 'lodash';
import moment from 'moment';

let swarm = new Swarm(config.baseUrl, config.version);
let opts = {
  projects: ['meta'],
  votes: 2,
  committed: false
};
swarm.getReviewsOpened(opts).then(o => {
  console.log(o.reviews.length, o.totalCount);
});
