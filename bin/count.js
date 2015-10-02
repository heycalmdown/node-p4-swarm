#!/usr/bin/env babel-node
import Swarm from '../es6/index';
import config from './config.js';
import _ from 'lodash';
import moment from 'moment';

let swarm = new Swarm(config.baseUrl, config.version);
swarm.getReviewsOpened().then(o => {
  console.log(`Opened reviews\t: ${o.reviews.length}`);
  console.log(`Latest review\t: ${_.max(_.pluck(o.reviews, 'id'))}`);
  let yesterday = moment().add(-1, 'd').startOf('day');
  let aweekago = moment().add(-7, 'w').startOf('day');
  let moments = _.map(o.reviews, o => moment(o.created*1000));
  console.log(`After yesterday\t: ${_.filter(moments, o => o.isAfter(yesterday)).length}`);
  console.log(`Over a week\t: ${_.filter(moments, o => o.isAfter(aweekago)).length}`);
});
// vim: set et sts=2 sw=2 ts=2 ai:
