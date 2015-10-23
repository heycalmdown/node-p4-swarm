let local;
try {
  local = require('./config.local.json');
} catch (e) {
  local = {
    baseUrl: 'localhost:8080',
    version: 'v1'
  }
}

export default local;
