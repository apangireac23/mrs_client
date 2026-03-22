import cors from 'cors'
import express from 'express'
import { getMissingEnvVars } from './config.js'
import { errorHandler } from './middleware/error-handler.js'
import apiRouter from './routes/api.js'

const app = express()
const missingEnvVars = getMissingEnvVars()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({
    ok: missingEnvVars.length === 0,
    missing_env: missingEnvVars,
  })
})

app.use('/api', apiRouter)
app.use(errorHandler)

export default app
