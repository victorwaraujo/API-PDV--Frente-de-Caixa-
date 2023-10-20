import { Router } from 'express'
import {
  detailUser,
  registerUser,
  loginUser,
  editUser,
} from './controllers/user.js'

import {
  deleteProduct,
  detailProduct,
  listProducts,
  registerProduct,
  editProduct,
  listCategories,
} from './controllers/product.js'

import { userSchema, userLoginSchema } from './schemas/userSchema.js'
import productSchema from './schemas/productSchema.js'

import { loginRequired } from './middlewares/loginRequired.js'
import validationRequestBody from './middlewares/validationRequestBody.js'
import { clientSchema } from './schemas/clientSchema.js'
import {
  registerClient,
  detailClient,
  editClient,
  listClients,
} from './controllers/client.js'
import {
  existingCategory,
  existingProduct,
} from './middlewares/productMiddleware.js'
import existingClient from './middlewares/existingClient.js'
import existingData from './middlewares/existingData.js'
import { registerOrder, findAllOrder } from './controllers/order.js'
import orderSchema from './schemas/orderSchema.js'
import upload from './middlewares/multer.js'
import allowedImageTypes from './middlewares/allowedImageFormat.js'

const route = Router()

route.get('/categoria', listCategories)

route.post(
  '/usuario',
  validationRequestBody(userSchema),
  existingData('usuarios'),
  registerUser
)
route.post('/login', validationRequestBody(userLoginSchema), loginUser)

route.use(loginRequired)

route.get('/usuario', detailUser)
route.put('/usuario', validationRequestBody(userSchema), editUser)

route.post(
  '/produto',
  upload.single('product_image'),
  validationRequestBody(productSchema),
  existingCategory,
  allowedImageTypes,
  registerProduct
)
route.get('/produto', listProducts)
route.put(
  '/produto/:id',
  upload.single('product_image'),
  validationRequestBody(productSchema),
  existingCategory,
  existingProduct,
  allowedImageTypes,
  editProduct
)
route.get('/produto/:id', existingProduct, detailProduct)
route.delete('/produto/:id', existingProduct, deleteProduct)

route.post(
  '/cliente',
  validationRequestBody(clientSchema),
  existingData('clientes'),
  registerClient
)
route.put('/cliente/:id', validationRequestBody(clientSchema), editClient)
route.get('/cliente', listClients)
route.get('/cliente/:id', existingClient, detailClient)

route.post('/pedido', validationRequestBody(orderSchema), registerOrder)
route.get('/pedido', findAllOrder)

export default route
