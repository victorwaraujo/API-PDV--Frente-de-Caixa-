const allowedImageTypes = (req, res, next) => {
  const allowedImageTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
  ]

  if (req.file) {
    if (!allowedImageTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        mensagem:
          'Arquivo de imagem de produto em formato não aceito. Certifique-se que a imagem está em formato jpg/jpeg/png/gif',
      })
    }
  }
  next()
}

export default allowedImageTypes
