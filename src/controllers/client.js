import client from '../config/database.js'
import { foundCep } from '../utils/compiler.js'

const registerClient = async (req, res) => {
  const { nome, email, cpf, cep, numero, cidade, bairro, estado, rua } =
    req.body
  try {
    let registeredClient
    const data = await foundCep(cep)
    registeredClient = (
      await client('clientes')
        .insert({
          nome,
          email,
          cpf,
          cep,
          numero,
          cidade: cidade || data.localidade,
          bairro: bairro || data.bairro,
          estado: estado || data.uf,
          rua: rua || data.logradouro,
        })
        .returning('*')
    )[0]

    if (!registeredClient) {
      return res.status(400).json({ mensagem: 'Erro ao cadastrar Cliente.' })
    }

    return res.status(201).json(registeredClient)
  } catch (error) {
    return res.status(500).json({
      messagem: 'Erro interno do servidor',
    })
  }
}

const detailClient = async (req, res) => {
  try {
    return res.status(200).json(req.client)
  } catch (error) {
    return res.status(400).json({ mensagem: 'Erro interno do servidor.' })
  }
}

const editClient = async (req, res) => {
  const { id } = req.params
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
    req.body

  try {
    const existingEmail = await client('clientes')
      .whereNot('id', id)
      .where('email', email)
      .first()

    if (existingEmail) {
      return res.status(400).json({ mensagem: 'E-mail já em uso ' })
    }

    const existingCpf = await client('clientes')
      .whereNot('id', id)
      .where('cpf', cpf)
      .first()

    if (existingCpf) {
      return res.status(400).json({ mensagem: 'CPF já em uso ' })
    }

    await client('clientes').where('id', id).update({
      nome,
      email,
      cpf,
      cep,
      rua,
      numero,
      bairro,
      cidade,
      estado,
    })

    return res.status(200).json({ mensagem: 'Cliente atualizado com sucesso.' })
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno do servidor' })
  }
}

const listClients = async (req, res) => {
  try {
    const clients = await client('clientes')
    return res.status(200).json(clients)
  } catch (error) {
    return res.status(500).json({ menssagem: 'Erro interno servidor' })
  }
}

export { registerClient, detailClient, editClient, listClients }
