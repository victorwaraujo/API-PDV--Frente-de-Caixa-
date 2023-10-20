import joi from 'joi'

const clientSchema = joi.object({
  nome: joi.string().trim().required().max(100).messages({
    'string.empty': 'Campo nome é obrigatório',
    'any.required': 'Campo nome é obrigatório',
    'string.max': 'Campo nome tem o limite máximo de 100 caracteres',
  }),
  email: joi.string().trim().email().required().max(100).messages({
    'string.empty': 'Campo email é obrigatório',
    'any.required': 'Campo email é obrigatório',
    'string.email': 'Campo email precisa ter um formato válido',
    'string.max': 'Campo email tem o limite máximo de 100 caracteres',
  }),
  cpf: joi
    .string()
    .trim()
    .min(11)
    .max(11)
    .required()
    .pattern(/^\d+$/)
    .messages({
      'string.min': 'O campo CPF deve conter exatamente 11 caracteres',
      'string.max': 'O campo CPF deve conter exatamente 11 caracteres',
      'any.required': 'O campo CPF é obrigatório',
      'string.empty': 'O campo CPF é obrigatório',
      'string.pattern.base': 'O campo CPF deve conter apenas dígitos numéricos',
    }),
  cep: joi.string().min(8).max(8).messages({
    'string.min': 'O campo cep deve conter exatamente 11 caracteres',
    'string.max': 'O campo cep deve conter exatamente 11 caracteres',
  }),
  rua: joi.string().max(100).message({
    'string.max': 'Campo rua tem o limite máximo de 100 caracteres',
  }),
  numero: joi.number().integer().min(1).messages({
    'number.base': 'O campo numero deve ser um número inteiro',
    'number.integer': 'O campo numero deve ser um número inteiro',
    'number.min': 'O campo numero deve conter no mínimo 1 caractere',
   
  }),
  bairro: joi.string().max(100).message({
    'string.max': 'Campo bairro tem o limite máximo de 100 caracteres',
  }),
  cidade: joi.string().max(100).message({
    'string.max': 'Campo cidade tem o limite máximo de 100 caracteres',
  }),
  estado: joi.string().max(100).message({
    'string.max': 'Campo estado tem o limite máximo de 100 caracteres',
  }),
})

export { clientSchema }
