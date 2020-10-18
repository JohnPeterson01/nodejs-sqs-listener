import * as eventTypes from './eventTypes'
import { post } from '../connector'
import { updatePollingFrequency } from './polling'
import logger from '../logging/logger'

export const processMessage = async (messageData) => {
  // Get the first message from the queue of messages - in future will look to process in batches
  logger('Processing an event message')
  const {
    receiptHandle,
    eventType,
    eventData
  } = messageData

  if (eventType == eventTypes.UPDATE_POLLING_FREQUENCY_REQUEST) {
    updatePollingFrequency(eventData)
    return receiptHandle
  }

  const microserviceRoute = getMicroserviceRoute(eventType)
  if (microserviceRoute != '') {
    logger(`Microservice route found: '${microserviceRoute}'`)

    await post(microserviceRoute, eventData).then(response => {
      logger('Event processed and sent to the microservice')
      if (response.status == 200) {
        logger(`Event was successfully sent and processed by microservice. Response status code: ${response.status}`)
      } else {
        logger(`There was an issue when processing the event from the microservice. Response status code: ${response.status}`)
      }
    }).catch((error) => {
      logger(`There was an error when posting data to the microservice: ${error}`)
      // TODO: add in a dead letter queue so events that error can be sent somewhere
    })
  }
  return receiptHandle
}

const getMicroserviceRoute = (eventType) => {
  logger(`Finding microservice route for event type: '${eventType}'`)

  let microserviceRoute = ''
  switch (eventType) {
    case eventTypes.NEW_EVENT_TYPE_1:
      microserviceRoute = `route/new-event`
      break
    default:
      logger('No route found')
  }
  return microserviceRoute
}

export const extractMessages = (queueData) => {
  // Returns list of messages to process
  let messages = []
  for (const message in queueData.Messages) {
    try {
      const receiptHandle = message.ReceiptHandle
      const messageBody = JSON.parse(message.Body)
      const eventType = messageBody.MessageAttributes.eventType.Value
      const eventData = JSON.parse(messageBody.Message)
      messages.push({
        receiptHandle,
        eventType,
        eventData
      })
    }
    catch (error) {
      logger('Error when parsing the event message')
      throw error
    }
  }
  return messages
}