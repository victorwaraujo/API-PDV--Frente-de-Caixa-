import client from '../config/database.js'
import { deletePicture, uploadPicture } from '../config/storage.js'

export const listCategories = async (req, res) => {
  try {
    const categories = await client('categorias')
    return res.json(categories)
  } catch (error) {
    return res.status(500).json({ menssagem: 'Erro interno servidor' })
  }
}

const registerProduct = async (req, res) => {
  const { descricao, quantidade_estoque, categoria_id, valor } = req.body

  try {
    const existingProduct = await client('produtos')
      .where({ descricao })
      .first()
    if (existingProduct) {
      return res
        .status(400)
        .json('O campo descrição já existe em um produto cadastrado')
    }

    let newProduct = await client('produtos')
      .insert({
        descricao,
        quantidade_estoque,
        categoria_id,
        valor,
      })
      .returning('*')

    if (newProduct.length === 0) {
      return res.status(400).json({ mensagem: 'Erro ao cadastrar produto.' })
    }

    if (req.file) {
      const { originalname, mimetype, buffer } = req.file
      const id = newProduct[0].id

      const productImage = await uploadPicture(
        `produtos/${id}/${originalname}`,
        buffer,
        mimetype
      )

      newProduct = await client('produtos')
        .update({
          produto_imagem: productImage.url,
        })
        .where({ id })
        .returning('*')
    }

    return res.status(201).json(newProduct[0])
  } catch (error) {
    res.status(500).json({
      mensagem: 'Erro interno do servidor.',
    })
  }
}

const listProducts = async (req, res) => {
  const { categoria_id: filter } = req.query

  try {
    if (filter) {
      const productsCategory = await client('produtos').whereIn(
        'categoria_id',
        Array.isArray(filter) ? filter : [filter]
      )
      return res.json(productsCategory)
    }
    const products = await client('produtos')
    return res.status(200).json(products)
  } catch (error) {
    return res.status(500).json({ menssagem: 'Erro interno servidor' })
  }
}

const deleteProduct = async (req, res) => {
  const { id } = req.params

  try {
    const existingImage = req.product.produto_imagem
    if (existingImage) {
      await deletePicture(`produtos/${id}`)
    }

    await client('produtos').del().where({ id })
    return res.status(204).send()
  } catch (error) {
    return res.status(500).json({ menssagem: 'Erro interno servidor' })
  }
}

const detailProduct = async (req, res) => {
  try {
    return res.status(200).json(req.product)
  } catch (error) {
    return res.status(400).json({ mensagem: 'Erro interno do servidor.' })
  }
}

const editProduct = async (req, res) => {
  const { descricao, quantidade_estoque, categoria_id, valor } = req.body
  const id = req.params.id

  try {
    const existingProduct = await client('produtos')
      .whereNot({ id })
      .where({ descricao })
      .first()
    if (existingProduct) {
      return res
        .status(400)
        .json('O campo descrição já existe em um produto cadastrado')
    }
    let updatedProduct = await client('produtos').where({ id }).update({
      descricao,
      quantidade_estoque,
      categoria_id,
      valor,
    })

    if (req.file) {
      const { originalname, mimetype, buffer } = req.file
      if (req.product.produto_imagem) {
        await deletePicture(`produtos/${id}`)
      }

      const productImage = await uploadPicture(
        `produtos/${id}/${originalname}`,
        buffer,
        mimetype
      )

      updatedProduct = await client('produtos')
        .update({
          produto_imagem: productImage.url,
        })
        .where({ id })
        .returning('*')
    }

    if (!updatedProduct) {
      return res.status(400).json({ mensagem: 'O produto não foi atualizado.' })
    }

    return res.status(200).json({ mensagem: 'Produto atualizado com sucesso' })
  } catch (error) {
    return res.status(500).json('Erro interno do servidor.')
  }
}

export {
  registerProduct,
  listProducts,
  deleteProduct,
  detailProduct,
  editProduct,
}
