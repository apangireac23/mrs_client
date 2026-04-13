export function createValidator(validateFn, source = 'body') {
  return (req, res, next) => {
    const data = source === 'query' ? req.query : req.body
    const result = validateFn(data)

    if (!result.success) {
      const errors = result.error?.issues?.map((err) => ({
        field: err.path?.join('.') || 'unknown',
        message: err.message,
      })) || [{ field: 'unknown', message: 'Invalid input' }]
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      })
    }

    req.validated = result.data
    next()
  }
}
