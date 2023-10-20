import fs from 'fs/promises'
import handlebars from 'handlebars'
import axios from 'axios'

const compilerHtml = async (arquivo, contexto) => {
  const html = await fs.readFile(arquivo)

  const compilador = handlebars.compile(html.toString())

  const htmlString = compilador(contexto)
  return htmlString
}

const foundCep = async (cep) => {
  const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
  const data = response.data
  return data
}

export { compilerHtml, foundCep }
