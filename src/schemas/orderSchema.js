import Joi from 'joi'

const orderSchema = Joi.object({
  cliente_id: Joi.number().integer().required().min(0).messages({
    'number.base': 'O campo cliente_id deve ser um número',
    'any.required': 'Campo cliente_id é obrigatório',
  }),
  observacao: Joi.string().allow(''),
  pedido_produtos: Joi.array()
    .items(
      Joi.object({
        produto_id: Joi.number().integer().required().messages({
          'any.required': 'O campo produto_id é obrigatório.',
          'number.integer': 'O campo produto_id deve ser um número inteiro.',
          'number.base': 'O campo produto_id deve ser um número.',
        }),
        quantidade_produto: Joi.number().integer().min(1).required().messages({
          'number.base': 'O campo quantidade_produto deve ser um número.',
          'number.integer':
            'O campo quantidade_produto deve ser um número inteiro.',
          'any.required': 'O campo quantidade_produto é obrigatório.',
          'number.min': 'A quantidade mínima permitida é 1.',
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      'any.required':
        'A matriz pedido_produtos é obrigatória e deve conter pelo menos um produto.',
      'array.min': 'Quantidade mínima de 1 produto.',
    }),
})

export default orderSchema
