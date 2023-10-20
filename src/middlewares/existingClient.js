import client from '../config/database.js'

const existingClient = async (req, res, next) => {
  const { id } = req.params
  const clientFound = await client('clientes').where({ id }).first()
  if (!clientFound) {
    return res.status(404).json({ mensagem: 'Cliente não encontrado' })
  }
  req.client = clientFound
  next()
}

export default existingClient
