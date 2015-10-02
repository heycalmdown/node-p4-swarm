let local;
try {
  local = require('./config.local.json');
} catch (e) {
  local = {
    baseUrl: 'localhost:8080',
    version: '1'
  }
}

export default local;
