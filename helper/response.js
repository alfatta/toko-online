const package = require('../package.json')

module.exports = (status = null, message = null, data = null, meta = {}) => {
  return {
    status,
    message,
    data,
    meta: {
      version: package.version,
      ...meta
    }
  }
}