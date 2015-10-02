#!/usr/bin/env babel-node
import Swarm from '../index';
import config from '../config.js';
import _ from 'lodash';
import moment from 'moment';

let swarm = new Swarm(config.baseUrl, config.version);
swarm.getReviewsOpened().then(o => {
  let yesterday = moment().add(-1, 'd').startOf('day');
  let novotes = _(o.reviews)
      .filter(review => moment(review.created*1000).isBefore(yesterday) && review)
      .filter(review => !_.some(review.participants, p => p.vote && !p.vote.isStale && p.vote.value === 1))
      .value();

  novotes.forEach(r => {
    console.log(`<a href="${config.baseUrl}/reviews/${r.id}">${r.id}</a>${r.description.split('\n')[0]} (${moment(r.updated*1000).fromNow()})`);
  });
  console.log(novotes.length);
});
// vim: set et sts=2 sw=2 ts=2 ai:
