import axios from 'axios'

const { PARENT_SERVICE_HOSTNAME } = process.env

const defaultHeaders = {
  'Content-Type': 'application/json'
}

const createUrl = urlPath => `${PARENT_SERVICE_HOSTNAME}/api/${urlPath}`

export const post = (url, data) => axios({
  method: 'POST',
  url: createUrl(url),
  data,
  headers: defaultHeaders
})
