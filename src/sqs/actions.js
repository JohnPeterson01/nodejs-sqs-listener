import { sqs, sqsReceiveParams } from './config'
import { processMessage, extractMessages } from './process'
import logger from '../logging/logger'

const { SQS_QUEUE_URL } = process.env

const receiveMessage = receiveParams => new Promise((resolve, reject) => {
  logger('Going to get queue data')

  sqs.receiveMessage(receiveParams, (error, data) => {
    if(error) {
      logger(`There was an error receiving the sqs message: ${error}`)
      reject(new Error(error))
    } else {
      logger('Returning queue data')
      resolve(data)
    }
  })
})

const deleteMessage = receiptMessage => new Promise((resolve, reject) => {
  logger('Deleting event queue message')

  const deleteParams = {
    QueueUrl: SQS_QUEUE_URL,
    ReceiptHandle: receiptMessage,
  }

  sqs.deleteMessage(deleteParams, (error, data) => {
    if (error) {
      logger(`There was an error deleting the sqs message: ${error.stack}`)
      reject(new Error(error))
    } else {
      logger('Event queue message deleted')
      resolve(data)
    }
  })
})

export const checkForMessage = async () => {
  logger('Polling for message')

  try {
    const queueData = await receiveMessage(sqsReceiveParams)
    if (
      queueData &&
      queueData.Messages &&
      queueData.Messages.length > 0
    ) {
      // Separate out into multiple messages here
      const messages = extractMessages(queueData)
      for(const message of messages){
        const receiptHandle = await processMessage(message)
        logger(`receiptHandle returned: ${receiptHandle}`)
        await deleteMessage(receiptHandle)
      }
    } else {
      logger('No messages found')
    }
  } catch (error) {
    logger(`There was an error with the queue data: ${error}`)
    setTimeout(checkForMessage, globalPollingFrequency)
    return
  }
  setTimeout(checkForMessage, globalPollingFrequency)
  return
}