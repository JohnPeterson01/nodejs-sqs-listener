import logger from '../logging/logger'

export default (request, response, next) => {
  logger('Checking API key')
  next()
}