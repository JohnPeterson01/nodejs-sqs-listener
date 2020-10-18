# Welcome to the nodejs sqs listener

## Background as to what lead me to develop this
Recently I watched a video on Experian's event based AWS architecture (https://www.youtube.com/watch?v=c_WNBmEc6EE) where they mentioned they used a node js sqs listener to decouple business logic and event processing. I decided to build my own version to learn more about sqs/sns and to understand what benefits this could bring to an existing application architecture. I welcome any feedback / thoughts / comments / suggestions.

## About the service
This service can be run as a sidecar container to hook up a microservice to an sqs queue whilst preserving the parent's service ability to serve RESTful api requests to different endpoints. The purpose of this sqs listener to take messages from an sqs queue and convert it into a RESTful api request.

## Main features
1. Convert sqs events into RESTful api requests
2. Update polling frequency whilst the service is live (i.e use a polling frequency update event type)
3. Delete events from the queue once it's finished processing

## Benefits of using the nodejs sqs listener
1. Separation of duties: by separating the processing of events and business logic, this can keep your architecture decoupled.
2. Integration with existing architecture: If current architecture is reliant on restful APIs, the listener can be used to add the additional capabilities of event processing to microservices.

## Run the service
In order to start the service locally, go into the 'src' folder and run
```bash
npm i && npm run dev
```

## Dependencies for running locally
1. localstack (https://github.com/localstack/localstack) used to mock aws services


## Still to do
1. Add in tests
2. Add dockerfile
3. Docker compose and setup scripts
4. Give examples of eventData structure that can be used (sample parent event and polling frequency update)
