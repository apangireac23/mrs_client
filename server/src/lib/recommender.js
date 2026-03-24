import axios from 'axios'
import { config } from '../config.js'

function getRecommenderUrl(path) {
  return `${config.recommenderApiUrl.replace(/\/+$/, '')}${path}`
}

async function postWithRetry(url, payload, { timeout = 60000, retries = 3, retryDelay = 5000 } = {}) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(url, payload, { timeout })
      return response.data
    } catch (err) {
      const isLast = attempt === retries
      console.error(`Request to ${url} failed (attempt ${attempt}/${retries}):`, {
        message: err.message,
        code: err.code,
        status: err.response?.status,
        data: err.response?.data,
      })

      if (isLast) throw err
      console.log(`Retrying in ${retryDelay / 1000}s...`)
      await new Promise(r => setTimeout(r, retryDelay))
    }
  }
}

export async function forwardEvent(payload) {
  return postWithRetry(getRecommenderUrl('/v1/events'), payload)
}

export async function fetchRecommendations(payload) {
  return postWithRetry(getRecommenderUrl('/recommendations'), payload)
}