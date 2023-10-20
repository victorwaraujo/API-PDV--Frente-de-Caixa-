import client from '../config/database.js'

const existingProduct = async (req, res, next) => {
  const { id } = req.params
  const productFound = await client('produtos').where({ id }).first()
  if (!productFound) {
    return res.status(404).json({ mensagem: 'Produto não encontrado' })
  }
  if (productFound.estoque_reservado > 0) {
    return res.status(400).json({
      mensagem:
        'Não é possível excluir o produto. Estoque reservado por um ou mais pedidos',
    })
  }
  req.product = productFound
  next()
}

const existingCategory = async (req, res, next) => {
  const { categoria_id } = req.body
  const categoryFound = await client('categorias')
    .select('id')
    .where('id', categoria_id)
    .first()

  if (!categoryFound) {
    return res.status(400).json({ mensagem: 'Categoria não encontrada.' })
  }
  next()
}

export { existingProduct, existingCategory }
