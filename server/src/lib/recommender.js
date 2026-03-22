import axios from 'axios'
import { config } from '../config.js'

function getRecommenderUrl(path) {
  return `${config.recommenderApiUrl.replace(/\/+$/, '')}${path}`
}

export async function forwardEvent(payload) {
  const response = await axios.post(getRecommenderUrl('/v1/events'), payload, {
    timeout: 10000,
  })
  return response.data
}

export async function fetchRecommendations(payload) {
  const response = await axios.post(getRecommenderUrl('/recommendations'), payload, {
    timeout: 10000,
  })
  return response.data
}
