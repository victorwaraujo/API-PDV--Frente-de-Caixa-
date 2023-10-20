import joi from 'joi'

const userSchema = joi.object({
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
  senha: joi.string().trim().required().min(8).messages({
    'string.empty': 'Campo senha é obrigatório',
    'any.required': 'Campo senha é obrigatório',
    'string.min': 'Campo senha tem o limite mínimo de 8 caracteres',
  }),
})

const userLoginSchema = joi.object({
  email: joi.string().trim().email().required().max(100).messages({
    'string.empty': 'Campo email é obrigatório',
    'any.required': 'Campo email é obrigatório',
    'string.email': 'Campo email precisa ter um formato válido',
    'string.max': 'Campo email tem o limite máximo de 100 caracteres',
  }),
  senha: joi.string().trim().required().min(8).messages({
    'string.empty': 'Campo senha é obrigatório',
    'any.required': 'Campo senha é obrigatório',
    'string.min': 'Campo senha tem o limite mínimo de 8 caracteres',
  }),
})

export { userSchema, userLoginSchema }
