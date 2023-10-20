import { hash, compare } from 'bcrypt'
import client from '../config/database.js'
import Jwt from 'jsonwebtoken'

const registerUser = async (req, res) => {
  const { nome, email, senha } = req.body

  try {
    const encryptedPassword = await hash(senha, 10)

    const idUser = (
      await client('usuarios')
        .insert({
          nome,
          email,
          senha: encryptedPassword,
        })
        .returning('id')
    )[0].id

    if (!idUser) {
      return res.status(400).json({ mensagem: 'Erro ao cadastrar usuário' })
    }

    return res.status(201).json({
      id: idUser,
      nome,
      email,
    })
  } catch (error) {
    return res.status(500).json({
      messagem: 'Erro interno servidor',
    })
  }
}

const detailUser = async (req, res) => {
  try {
    return res.status(200).json(req.loggedUser)
  } catch {
    return res.status(500).json({ mensagem: 'Erro interno do servidor' })
  }
}

const loginUser = async (req, res) => {
  const { email, senha } = req.body

  try {
    const user = await client('usuarios').where('email', email).first()

    if (!user) {
      return res.status(401).json({
        mensagem: 'Email ou senha inválida',
      })
    }

    const passwordMatch = await compare(senha, user.senha)

    if (!passwordMatch) {
      return res.status(401).json({
        mensagem: 'Email ou senha inválida',
      })
    }

    const token = Jwt.sign({ userId: user.id }, process.env.SENHA_JWT, {
      expiresIn: '2h',
    })
    return res.status(200).json({
      mensagem: 'Login bem-sucedido',
      token,
    })
  } catch (error) {
    return res.status(500).json({
      mensagem: 'Erro interno do servidor',
    })
  }
}

const editUser = async (req, res) => {
  const { nome, email, senha } = req.body
  const { id } = req.loggedUser

  try {
    const existingEmail = await client('usuarios')
      .whereNot({ id })
      .where({ email })
      .first()

    if (existingEmail) {
      return res.status(400).json({ mensagem: 'E-mail já em uso ' })
    }

    const encryptedPassword = await hash(senha, 10)

    const updatedUser = await client('usuarios')
      .where({ id: req.loggedUser.id })
      .update({
        nome,
        email,
        senha: encryptedPassword,
      })

    if (!updatedUser) {
      return res.status(400).json({ mensagem: 'O usuário não foi atualizado.' })
    }

    return res
      .status(200)
      .json({ mensagem: 'Usuário foi atualizado com sucesso.' })
  } catch {
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' })
  }
}

export { detailUser, registerUser, loginUser, editUser }
