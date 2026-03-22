import app from './app.js'
import { config, getMissingEnvVars } from './config.js'

const missingEnvVars = getMissingEnvVars()

if (missingEnvVars.length > 0) {
  console.warn(`Missing environment variables: ${missingEnvVars.join(', ')}`)
}

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`)
})
