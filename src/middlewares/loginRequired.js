import client from '../config/database.js'
import jwt from 'jsonwebtoken'

const loginRequired = async (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({
      mensagem:
        'Para acessar este recurso um token de autenticação válido deve ser enviado.',
    })
  }
  const token = authorization.split(' ')[1]
  try {
    const validUserToken = jwt.verify(token, process.env.SENHA_JWT)
    const user = await client('usuarios')
      .where({ id: validUserToken.userId })
      .select('id', 'nome', 'email')
      .first()

    if (!user) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado!' })
    }

    req.loggedUser = user

    next()
  } catch (error) {
    return res.status(401).json({
      mensagem:
        'Para acessar este recurso um token de autenticação válido deve ser enviado.',
    })
  }
}

export { loginRequired }
