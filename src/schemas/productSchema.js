import Joi from 'joi'

const productSchema = Joi.object({
  descricao: Joi.string().required().messages({
    'string.empty': 'Campo descrição é obrigatório',
    'any.required': 'Campo descrição é obrigatório',
  }),
  quantidade_estoque: Joi.number().required().min(0).integer().messages({
    'number.base': 'É necessario informar um valor para o estoque',
    'any.required': 'Campo quantidade é obrigatório',
    'number.min': 'Campo quantidade deve ser no mínimo 0',
  }),
  valor: Joi.number().required().min(0).integer().messages({
    'number.base': 'É necessario informar um valor !',
    'any.required': 'Campo valor é obrigatório',
    'number.min': 'Campo valor deve ser no mínimo 0',
  }),
  categoria_id: Joi.number().required().messages({
    'number.base':
      'É necessário informar o ID da categoria que deseja cadastrar.',
    'any.required':
      'É necessário informar o ID da categoria que deseja cadastrar.',
  }),
  product_image: Joi.allow(),
})

export default productSchema
