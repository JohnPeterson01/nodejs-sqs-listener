import aws from 'aws-sdk'

const { 
  SQS_URL, 
  SQS_QUEUE_URL, 
  AWS_REGION, 
  AWS_ACCESS_KEY, 
  AWS_SECRET_KEY 
} = process.env

const awsCredentials = new aws.Credentials(AWS_ACCESS_KEY, AWS_SECRET_KEY)
aws.config.update({ region: AWS_REGION, credentials: awsCredentials })

const sqs = new aws.SQS({ endpoint: SQS_URL });

const sqsReceiveParams = {
  QueueUrl: SQS_QUEUE_URL,
  MaxNumberOfMessages: 1,
  MessageAttributeNames: [
    "All"
  ],
};

export { aws, sqs, sqsReceiveParams }
