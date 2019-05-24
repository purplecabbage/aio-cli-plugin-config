const config = require('@adobe/aio-cli-config')
const OldConf = require('conf')
const debug = require('debug')('aio-cli-plugin-conf')
const hjson = require('hjson')

/**
 * return parsed json if it's a string else just return the value
 *
 * @param {Object} item
 * @throws SyntaxError
 */
const toJson = (item) => {
  if (typeof item === 'string') {
    return JSON.parse(item)
  }
  return item
}

/**
 * Move all keys to aio-cli-config
 *
 * @param {Function} debug
 */
const upgrade = () => {
  try {
    const oldConf = new OldConf({ projectName: '@adobe/aio-cli-plugin-config' })
    let data = oldConf.store
    delete data['__backup__']

    if (data != null && Object.keys(data).length > 0) {
      oldConf.clear()
      oldConf.set('__backup__', data)
      config.set(null, toJson(data))
      debug('config upgraded')
    }
  } catch (e) {
    debug(`upgrade failed: ${e.message}`)
  }
}

/**
 * 1. hoists variables in the ./.env file to process.env
 * 2. upgrades existing 'conf' configuration to aio-cli-config
 * 3. prints out active config
 */
module.exports = async function() {
  upgrade()
  config.dotenv()
  debug(hjson.stringify(config.get(), {
    condense: true,
    emitRootBraces: true,
    separator: true,
    bracesSameLine: true,
    multiline: 'off',
    colors: false }))
}
