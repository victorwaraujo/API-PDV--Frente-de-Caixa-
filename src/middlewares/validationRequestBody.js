const validationRequestBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body)
    next()
  } catch (error) {
    return res.status(400).json({ messagem: error.message })
  }
}

export default validationRequestBody
