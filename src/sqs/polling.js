import logger from '../logging/logger'

export const updatePollingFrequency = eventData => {
  const { pollingFrequency } = eventData
  globalPollingFrequency = pollingFrequency
  logger(`Polling frequency updated to every ${pollingFrequency} ms`)
}