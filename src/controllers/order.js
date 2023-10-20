import client from '../config/database.js'
import transporter from '../config/mail.js'
import { compilerHtml } from '../utils/compiler.js'

const registerOrder = async (req, res) => {
  const { cliente_id, pedido_produtos, observacao } = req.body

  try {
    const existingClient = await client('clientes')
      .where({ id: cliente_id })
      .first()
    if (!existingClient) {
      return res.status(400).json('Cliente não encontrado.')
    }

    let amount = 0
    let productPromises = []
    for (const item of pedido_produtos) {
      const product = await client('produtos')
        .where({ id: item.produto_id })
        .first()

      if (!product) {
        return res.status(400).json({ mensagem: 'Produto não encontrado.' })
      }

      if (
        item.quantidade_produto >
        product.quantidade_estoque - product.estoque_reservado
      ) {
        return res
          .status(400)
          .json({ mensagem: 'Quantidade insuficiente em estoque.' })
      }

      amount += item.quantidade_produto * product.valor

      await client('produtos')
        .where({ id: item.produto_id })
        .increment('estoque_reservado', item.quantidade_produto)
      productPromises.push({ item, product })
    }

    const products = await Promise.all(productPromises)

    const newOrder = await client('pedidos')
      .insert({
        observacao,
        valor_total: amount,
        cliente_id,
      })
      .returning('*')

    const orderId = newOrder[0].id

    const orderProductPromises = products.map(async ({ item, product }) => {
      const productValue = item.quantidade_produto * product.valor

      await client('pedido_produtos').insert({
        pedido_id: orderId,
        produto_id: item.produto_id,
        quantidade_produto: item.quantidade_produto,
        valor_produto: productValue,
      })
    })

    await Promise.all(orderProductPromises)

    if (newOrder.length === 0) {
      return res.status(400).json({ mensagem: 'Erro ao cadastrar produto.' })
    }

    const html = await compilerHtml('./src/templates/mail.html', {
      clientName: existingClient.nome,
    })

    transporter.sendMail({
      from: `${process.env.EMAIL_NOME} <${process.env.EMAIL_FROM}>`,
      to: `${existingClient.nome} <${existingClient.email}>`,
      subject: 'Pedido Realizado com Sucesso',
      html,
    })

    return res.status(201).json(newOrder)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      mensagem: 'Erro interno do servidor.',
    })
  }
}

const findAllOrder = async (req, res) => {
  const { cliente_id } = req.query
  let result = []

  try {
    let query = client('pedidos')
      .select(
        'pedidos.id',
        'pedidos.cliente_id',
        'pedidos.observacao',
        'pedidos.valor_total'
      )
      .leftJoin('pedido_produtos', 'pedidos.id', 'pedido_produtos.pedido_id')
      .distinct('pedidos.id')
      .orderBy('pedidos.id')

    if (cliente_id) {
      const clientFound = await client('clientes')
        .where('id', cliente_id)
        .first()

      if (!clientFound) {
        return res.status(404).json({ mensagem: 'O cliente não encontrado.' })
      }
      query.where('pedidos.cliente_id', cliente_id).orderBy('pedidos.id')
    }

    const orders = await query

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ mensagem: 'Esse cliente não possui pedidos.' })
    }

    for (const order of orders) {
      const pedido_produtos = await client('pedido_produtos')
        .where('pedido_id', order.id)
        .select(
          'id',
          'pedido_id',
          'produto_id',
          'quantidade_produto',
          'valor_produto'
        )

      result.push({
        pedido: {
          id: order.id,
          valor_total: order.valor_total,
          observacao: order.observacao,
          cliente_id: order.cliente_id,
        },
        pedido_produtos,
      })
    }

    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' })
  }
}

export { registerOrder, findAllOrder }
