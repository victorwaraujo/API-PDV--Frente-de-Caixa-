import client from '../config/database.js'

const existingData = (nameTable) => {
  const tables = {
    usuarios: async (req, res, next) => {
      const { email } = req.body

      const idUser = await client(nameTable).where({ email }).first()

      if (idUser) {
        return res.status(400).json({
          messagem: 'Email ou senha inválida',
        })
      }

      next()
    },

    clientes: async (req, res, next) => {
      const { email, cpf } = req.body
      const existingEmail = await client(nameTable).where({ email }).first()
      const existingCpf = await client(nameTable).where({ cpf }).first()

      if (existingEmail) {
        return res.status(400).json({ mensagem: 'Email inválido.' })
      }

      if (existingCpf) {
        return res.status(400).json({ mensagem: 'Cpf inválido.' })
      }

      next()
    },
  }

  return tables[nameTable]
}

export default existingData
